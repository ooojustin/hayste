from django.db import models
from django.conf import settings

from common import constants

class Transaction(models.Model):

    class Meta:
        abstract = True
    
    created = models.DateTimeField(auto_now_add = True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name = "transactions")
    txn_id = models.CharField(max_length = 32, unique = True)
    status = models.CharField(max_length = 32, choices = constants.TRANSACTION_STATUS, default = "Pending")
    amount = models.DecimalField(max_digits = 10, decimal_places = 2)

class VIPPurchase(Transaction):

    threads = models.IntegerField()
    duration = models.DurationField()
