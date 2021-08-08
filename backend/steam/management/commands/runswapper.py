from django.core.management.base import BaseCommand
from django.db.models import Q
from django.utils import timezone

from datetime import timedelta

import requests

from steam.models import SteamSwap
from management.models import SwapperNode

class Command(BaseCommand):
    help = "Run the steam swapper background service (runs indefinitely)"
    
    def handle(self, *args, **options):
        
        # get current node public ip address
        ip_response = requests.get("http://ip-api.com/json/")
        ip_response.raise_for_status()
        ip_data = ip_response.json()
        ip_address = ip_data.get("query")
        assert ip_address, "Failed to detect node IP address."

        # use ip to detect current node, update usage statistics
        node = SwapperNode.objects.get(ip_address = ip_address)
        node.update_stats()
        print("Currently running steamid.shop swapper on node:", node)

        # start threads to process swaps in the background. runs indefinitely.
        while True:
            print("Preparing to run process_swaps...")
            node.steam_swaps.update(node = None)
            node.process_swaps()
