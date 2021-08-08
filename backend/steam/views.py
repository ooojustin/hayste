from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from common.exceptions import *

from .models import *
from .serializers import *

class SteamAccountViewSet(viewsets.ModelViewSet):
    serializer_class = SteamAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        accounts = self.request.user.steam_accounts.order_by("-id")
        query = self.request.query_params.get("query")
        if query:
            accounts = accounts.filter(username__icontains = query)
        return accounts

    def create(self, request, *args, **kwargs):
        try:
            request.data["owner"] = self.request.user.id
            return super().create(request, *args, **kwargs)
        except SteamAccountLoginException as ex:
            return Response(status = ex.status_code)

class SteamSwapViewSet(viewsets.ModelViewSet):
    serializer_class = SteamSwapSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.steam_swaps.order_by("-last_checked")

    def create(self, request, *args, **kwargs):
        request.data["user"] = self.request.user.id
        return super().create(request, *args, **kwargs)

    def split(self, request):
        objects = self.get_queryset()
        data = {
            "claimed": objects.filter(claimed = True),
            "waiting": objects.filter(claimed__isnull = True).order_by("check_count"),
            "failed": objects.filter(claimed = False)
        }
        data = {
            k: SteamSwapSerializer(v, many = True).data 
            for k,v in data.items() 
        }
        return Response(data)

    def counts(self, request):
        swaps = SteamSwap.objects.filter(id__in = request.data)
        serializer = SteamSwapCountSerializer(swaps, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)
