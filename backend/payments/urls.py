from django.urls import path

from . import views

urlpatterns = [  
    path("ipn", views.coinpayments_ipn),
    path("create", views.purchase_vip)
]
