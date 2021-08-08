from rest_framework import serializers

from payments.models import *

class VIPPurchaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = VIPPurchase
        fields = "__all__"
