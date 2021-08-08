from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser

from .managers import CustomUserManager

from common import utils

class CustomUser(AbstractUser):
    
    email = models.EmailField(unique = True)
    first_name = None
    last_name = None
    
    objects = CustomUserManager()

    def __str__(self):
        return self.username

class UserInvite(models.Model):

    code = models.CharField(max_length = 32, default = utils.generate_invite_code)
    user = models.OneToOneField(CustomUser, null = True, blank = True, default = None, on_delete = models.SET_NULL, related_name = "invite")
    used = models.DateTimeField(null = True, blank = True, default = None) 

    def use(self, user):
        self.user = user
        self.used = timezone.now()
        self.save()
