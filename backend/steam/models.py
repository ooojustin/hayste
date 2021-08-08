from django.db import models
from django.utils import timezone
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.validators import MaxValueValidator, MinValueValidator
from rest_framework import status

from common import utils
from steam.swapper import SteamSwapperThread
from steam.managers import SteamAccountManager, SteamSwapManager

import requests, base64, pickle, re, time

from Crypto.Cipher import PKCS1_v1_5
from Crypto.PublicKey.RSA import construct

class SteamAccount(models.Model):

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name = "steam_accounts")
    username = models.CharField(max_length = 128)
    password = models.CharField(max_length = 128)
    steam_id = models.BigIntegerField(default = 0) # assigned upon initial login
    session = models.FileField(upload_to = "sessions/", null = True, default = None, editable = False)
    
    objects = SteamAccountManager()

    def set_url(self, target, session = None, name = None, verify = True, watermark = False):
        """
        Changes the users custom steam url.
        By default, this will also result in the persona name being changed to their steamid.shop username if another isn't specified.

        Parameters:
        session (requests.Session): An existing session object to use. This can save time if established beforehand.
        name (str): A persona name to use, instead of the steamid.shop account owner username. 
        verify (bool): After claiming the url, verify it was claimed with an additional request to 'get_current_url'.
        watermark (bool): Set the steam account's "real name" to the steamid.shop domain.
        """
        
        t1 = time.time()
        
        session = session or self.get_session()
        cookies = session.cookies.get_dict()
        url = f"https://steamcommunity.com/profiles/{self.steam_id}/edit/" # ???
        
        params = {
            "sessionID": cookies["sessionid"],
            "customURL": target,
            "personaName": name or self.owner.username,
            "type": "profileSave",
            "json": True
        }
        
        if watermark:
            # params["real_name"] = "steamid.shop"
            params["personaName"] += "@steamid.shop"
        
        files = { k: (None, v) for k, v in params.items() }
        response = session.post(url, files = files, timeout = 5)
        response.raise_for_status()
        data = response.json()
        assert data.get("success") == 1, data.get("errmsg", "An unknown error has occured while setting steam url.")
        
        t2 = time.time()
        delta = t2 - t1

        if verify:
            new = self.get_current_url()
            assert new == target, "Failed to verify that steam url has been changed."
        
    def get_current_url(self):
        """
        Get the users current custom steam url, using their steam id.
        Returns 'None' if it has not yet been set.
        * An active session is not required, since this information is public.
        """

        # send request to profile url via steam id - detect redirect
        profile_url = "https://steamcommunity.com/profiles/" + str(self.steam_id)
        profile_response = requests.get(profile_url, allow_redirects = False, timeout = 5)
        profile_response.raise_for_status()
        if profile_response.status_code == status.HTTP_302_FOUND:
            profile_url = profile_response.headers["Location"]
        
        # use regex to parse the users current setting from the new profile url
        pattern = "https:\/\/steamcommunity\.com\/id\/(.+)\/"
        match = re.search(pattern, profile_url)
        return match.group(1) if match else None
        
    def is_session_valid(self, session):
        response = session.get(f"https://steamcommunity.com/profiles/{self.steam_id}/edit/info")
        return not "/login/home/" in response.url

    def get_session(self, save = True):
        """
        Get a requests.Session object which can be used to send authenticated requests.
        If an existing session has been pickled and stored on our server, we create the session from that data.
        Otherwise, a new login request is sent to Steam to initialize a new session.
        """
        if self.session:
            with self.session.open() as sfile:
                sbytes = self.session.read()
            session = pickle.loads(sbytes)
            if not self.is_session_valid(session):
                self.session = None
                self.save()
                print("fix session")
                return self.get_session(save = save)
            return session
        else:
            try:
                session = self._login(save = save)
                return session
            except Exception as ex:
                print("Failed to login:", ex)

    def _login(self, save = True):
        """
        Uses the objects username/password fields to login to steam.
        If the login is successful, it will return a requests.Session object. Otherwise, it will reaise an exception.
        """
        
        # initialize session
        session = requests.Session()
        session.get("https://steamcommunity.com/login/home/?goto=")
        
        # retrieve rsa encryption key for password from steam
        get_key_data = { "username": self.username, "donotcache": str(utils.timestamp_ms()) }
        rsa_response = session.post("https://steamcommunity.com/login/getrsakey/", get_key_data, timeout = 5)
        rsa_response.raise_for_status()
        rsa_data = rsa_response.json()
        assert rsa_data.get("success"), rsa_data.get("message", "An unknown error has occurred while retrieving RSA key.") 

        # encrypt the password to prepare it for login request
        # based on steam's javascript rsa encryption: https://pastebin.com/u6eFRYRV
        mod = int(rsa_data["publickey_mod"], 16)
        exp = int(rsa_data["publickey_exp"], 16)
        pubkey = construct((mod, exp))
        cipher = PKCS1_v1_5.new(pubkey)
        pw = cipher.encrypt(self.password.encode())
        pw = base64.b64encode(pw).decode()
        
        # submit credentials (authenticate session)
        login_data = {
            "donotcache": str(utils.timestamp_ms()),
            "username": self.username,
            "password": pw,
            "rsatimestamp": rsa_data["timestamp"]
        }
        response = session.post("https://steamcommunity.com/login/dologin/", login_data, timeout = 5)
        response.raise_for_status()
        data = response.json()
        assert data.get("success"), data.get("message", "An unknown error has occurred while logging in.") 
        
        # save steam id for later use
        steam_id = data["transfer_parameters"]["steamid"]
        if int(steam_id) != self.steam_id:
            self.steam_id = steam_id

        # store session object in binary file on remote server to be recovered later
        if save:
            sbytes = pickle.dumps(session) # NOTE approx. 2500 bytes?
            sfile = ContentFile(sbytes, f"{self.steam_id}.bin")
            self.session = sfile
        
        self.save()
        return session

    def __str__(self):
        steam_id = self.steam_id if int(self.steam_id) > 0 else "?"
        return f"{self.username} ({steam_id})"
    
class SteamSwap(models.Model):

    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name = "steam_swaps")
    account = models.ForeignKey(SteamAccount, on_delete = models.CASCADE, related_name = "steam_swaps")
    target = models.CharField(max_length = 32)
    threads = models.IntegerField(default = 10, validators = [MinValueValidator(1), MaxValueValidator(100)])
    last_checked = models.DateTimeField(null = True, default = None)
    check_count = models.PositiveBigIntegerField(default = 0)
    node = models.ForeignKey("management.SwapperNode", null = True, default = None, blank = True, on_delete = models.SET_NULL, related_name = "steam_swaps")
    claimed = models.BooleanField(null = True, default = None)

    objects = SteamSwapManager()

    def claim(self, *args, **kwargs):
        session = getattr(self, "_session")
        self.account.set_url(self.target, session = session, *args, **kwargs)
        self.claimed = True
        self.save(update_fields = ["claimed"])
        print("Claimed SteamSwap:", self)

    def prepare(self):
        if not hasattr(self, "_session"):
            session = self.account.get_session()
            setattr(self, "_session", session)
            setattr(self, "_session_iter", 0)
            setattr(self, "_available", False)

    def get_threads(self):
        threads = [
            SteamSwapperThread(self, i, i == 0) \
            for i in range(self.threads)
        ]
        return threads
    
    def calc_cps(self):
        delta = timezone.now() - self.created
        seconds = delta.total_seconds()
        cps = round(self.check_count / seconds, 2)
        return cps


