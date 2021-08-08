from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path("", views.index),
    path("admin/", admin.site.urls),
    path("auth/", include("users.urls")),
    path("steam/", include("steam.urls")),
    path("pay/", include("payments.urls"))
]
