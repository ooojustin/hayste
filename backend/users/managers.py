from django.contrib.auth.base_user import BaseUserManager
from django.apps import apps

class CustomUserManager(BaseUserManager):

    def create_user(self, email, username, password, **extra_fields):
        email = self.normalize_email(email)
        UserModel = apps.get_model(self.model._meta.app_label, self.model._meta.object_name)
        username = UserModel.normalize_username(username)
        user = self.model(email = email, username = username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password, **extra_fields):
        extra_fields["is_staff"] = True
        extra_fields["is_superuser"] = True
        return self.create_user(email, username, password, **extra_fields)
