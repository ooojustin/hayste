from rest_framework import serializers

from .models import *

class SteamAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = SteamAccount
        exclude = ["session"]
        extra_kwargs = { 
            "owner": { "write_only": True },
            "password": { "write_only": True }
        }

    def create(self, validated_data):
        validated_data["try_login"] = True
        return super().create(validated_data)

class SteamSwapSerializer(serializers.ModelSerializer):

    account_obj = serializers.SerializerMethodField();
    cps = serializers.SerializerMethodField()

    class Meta:
        model = SteamSwap
        fields = "__all__"
        extra_kwargs = {
            "user": { "write_only": True }
        }

    def get_account_obj(self, obj):
        serializer = SteamAccountSerializer(obj.account)
        return serializer.data

    def get_cps(self, obj):
        return obj.calc_cps()

class SteamSwapCountSerializer(serializers.ModelSerializer):

    cps = serializers.SerializerMethodField()

    class Meta:
        model = SteamSwap
        fields = ["id", "check_count", "last_checked", "cps"]

    def get_cps(self, obj):
        return obj.calc_cps()

