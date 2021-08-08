from django.db import models
from django.db.models import Sum
from django.utils import timezone
from django.apps import apps
from django.utils import timezone

from datetime import timedelta

import uuid, psutil

from steam.models import SteamSwap
from management.nodethreads import NodePopulator, NodeStatUpdater

class SwapperNode(models.Model):

    id = models.UUIDField(default = uuid.uuid4, primary_key = True, editable = False)
    ip_address = models.GenericIPAddressField(protocol = "ipv4")
    threads = models.IntegerField(default = 0)
    cpu = models.FloatField(default = 0)
    ram = models.FloatField(default = 0)
    disk = models.FloatField(default = 0)
    max_threads = models.IntegerField(default = 500)

    def free_threads(self):
        return self.max_threads - self.threads

    def used_threads(self):
        min_checked = timezone.now() - timedelta(seconds = 5)
        swaps = self.steam_swaps.filter(last_checked__gte = min_checked)
        threads = swaps.aggregate(Sum("threads")).get("threads__sum") or 0
        return threads

    def update_stats(self):
        self.threads = self.used_threads()
        self.cpu = psutil.cpu_percent()
        self.ram = psutil.virtual_memory().percent
        self.disk = psutil.disk_usage("/").percent
        self.save()

    def establish_new_swaps(self):
        swaps = []
        calculated_threads = self.used_threads()
        for swap in SteamSwap.objects.free_swaps():
             if calculated_threads >= self.max_threads:
                 break
             swap.node = self
             swap.save()
             calculated_threads += swap.threads
             swaps.append(swap)
        return swaps

    def process_swaps(self):
        
        threads = []
        swaps = self.establish_new_swaps()
        for swap in swaps:
            swap.prepare()
            threads += swap.get_threads()
        
        threads.append(NodeStatUpdater(self))
        threads.append(NodePopulator(self, threads))
        
        print(f"Creating {len(threads)} for {len(swaps)} SteamSwaps.")

        [thread.start() for thread in threads]
        [thread.join() for thread in threads]   
