import threading, time

from steam.models import SteamSwap

class NodePopulator(threading.Thread):

    def __init__(self, node, threads):
        self._node = node
        self._threads = threads
        self._iter = 0
        self._kill = False
        super().__init__(target = self.run)

    def kill(self):
        self._kill = True

    def run(self):

        while not self._kill:
            
            og_swaps = list(SteamSwap.objects.filter(node = self._node))
            swaps = og_swaps + self._node.establish_new_swaps()
            if len(swaps) > len(og_swaps):
                # kill existing threads, force swaps to be picked up again
                self._threads.append(self)
                for t in self._threads:
                    if hasattr(t, "kill"):
                        t.kill()
            
            if not self._kill:
                time.sleep(5)


class NodeStatUpdater(threading.Thread):

    def __init__(self, node):
        self._node = node
        self._kill = False
        super().__init__(target = self.run)
    
    def kill(self):
        self._kill = True

    def run(self):

        while not self._kill:

            self._node.update_stats()
            print("Updated node stats:", self._node)
            time.sleep(30)

