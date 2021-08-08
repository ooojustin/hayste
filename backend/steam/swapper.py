from django.utils import timezone

import threading, time, requests, re, json
from datetime import timedelta
from common.steam import get_profile_data

class SteamSwapperThread(threading.Thread):
    
    def __init__(self, swap, id, is_primary = False):
        self._swap = swap
        self._id = id
        self._primary = is_primary
        self._kill = False
        if self._primary:
            self._primary_iter = 0
        super().__init__(target = self.run)

    def kill(self):
        self._kill = True

    def run(self):

        assert self._swap, "Thread not initialized."
        
        while self._swap.claimed is None and not self._kill:

            # check if the id is available
            url = "https://steamcommunity.com/id/" + self._swap.target
            available_flag = "<h3>The specified profile could not be found.</h3><br><br>"
            
            self._swap.check_count += 1
            min_checked = timezone.now() - timedelta(seconds = 1)
            if not self._swap.last_checked or self._swap.last_checked < min_checked:
                self._swap.last_checked = timezone.now()
                self._swap.save(update_fields = ["last_checked", "check_count"])

            response = requests.get(url)
            if available_flag in response.text and not self._swap._available:
                
                self._swap._available = True
                try:
                    self._swap.claim()
                except Exception as ex:
                    self._swap._available = False
            
            else:
                
                if not self._swap._available:
                    # TODO something with this data
                    profile_data = get_profile_data(src = response.text)

                time.sleep(0.1)
                if self._primary:
                    self._primary_iter += 1
                    if self._primary_iter >= 2000:
                        self._primary_iter = 0
                        self._swap._session = self._swap.account.get_session()
