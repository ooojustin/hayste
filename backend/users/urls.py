from django.urls import path

from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [
    path("login", obtain_auth_token),
    path("register", views.UserRegisterView.as_view()),
    path("user", views.CustomUserView.as_view())
]
