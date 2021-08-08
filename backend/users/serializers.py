from django.core.exceptions import ValidationError
from rest_framework import serializers

from .models import *

class UserDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "is_staff"]

class RegisterSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']
        extra_kwargs = { 'password': { 'write_only': True } }
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email = validated_data.get("email"),
            username = validated_data.get("username"),
            password = validated_data.get("password")
        )
        return user

class InvitedRegisterSerializer(RegisterSerializer):

    invite = serializers.CharField(max_length = 32, required = True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'invite']
        extra_kwargs = { 'password': { 'write_only': True } }

    def validate_invite(self, invite):
        try:
            inv = UserInvite.objects.get(code = invite)
            if inv.used:
                raise serializers.ValidationError("Invite code is already used.")
            else:
                return inv
        except UserInvite.DoesNotExist:
            raise serializers.ValidationError("Invite code does not exist.")
    
    def create(self, validated_data):
        user = super().create(validated_data)
        invite = validated_data.pop("invite")
        invite.use(user)
        return user
