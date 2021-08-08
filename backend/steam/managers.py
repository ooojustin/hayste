from django.db import models
from django.utils import timezone

from datetime import timedelta

from common.exceptions import *

class SteamAccountManager(models.Manager):

    def create(self, *args, **kwargs):
        try_login = kwargs.pop("try_login", False)
        account = super().create(*args, **kwargs)
        if try_login:
            try:
                account._login()
            except:
                account.delete()
                raise SteamAccountLoginException("Failed to execute SteamAccount._login upon object creation.")
        return account


class SteamSwapManager(models.Manager):

    def free_swaps(self):
        return self.filter(
            models.Q(claimed__isnull = True),
            models.Q(node__isnull = True) |
            models.Q(last_checked__lte = timezone.now() - timedelta(seconds = 5))
        )
