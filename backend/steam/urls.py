from django.urls import path

from . import views

urlpatterns = [
    
    path("accounts", views.SteamAccountViewSet.as_view({ "get": "list", "post": "create" })),
    path("accounts/<int:pk>", views.SteamAccountViewSet.as_view({ "delete": "destroy" })),
    
    path("swaps", views.SteamSwapViewSet.as_view({ "get": "list", "post": "create" })),
    path("swaps/split", views.SteamSwapViewSet.as_view({ "get": "split"})),
    path("swaps/counts", views.SteamSwapViewSet.as_view({ "post": "counts" })),
    path("swaps/<int:pk>", views.SteamSwapViewSet.as_view({ "delete": "destroy" }))

]
