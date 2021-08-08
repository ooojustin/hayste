from django.conf import settings

from urllib.parse import urlencode

import requests, hashlib, hmac

class CoinPayments:

    API_URL = "https://www.coinpayments.net/api.php"

    def __init__(self, pubkey, privkey):
        self.pubkey = pubkey
        self.privkey = privkey

    def gen_hmac(self, payload):
        kb = self.privkey.encode("utf-8")
        plb = urlencode(payload).encode("utf-8")
        sign = hmac.new(kb, plb, hashlib.sha512).hexdigest()
        return sign

    def create_transaction(self, amount, email):

        payload = {
            "version": 1,
            "cmd": "create_transaction",
            "amount": amount,
            "currency1": "USD",
            "currency2": "BTC",
            "buyer_email": email,
            "key": self.pubkey
        }
        
        sign = self.gen_hmac(payload)
        response = requests.post(CoinPayments.API_URL, data = payload, headers = { "HMAC": sign })
        response.raise_for_status()
        return response.json().get("result")

# https://www.coinpayments.net/merchant-tools-ipn#statuses
PAYMENT_COMPLETE = 100
IN_ESCROW = 5
PAYPAL_PENDING = 3
QUEUED_NIGHTLY = 2
PAYMENT_RECEIVED = 1
AWAITING_FUNDS = 0
PAYMENT_CANCELLED = -1
PAYMENT_REVERSAL = -2
MISSING_STATUS = -5

api = CoinPayments(settings.CP_PUBLIC_KEY, settings.CP_PRIVATE_KEY)

