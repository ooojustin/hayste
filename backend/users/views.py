from django.conf import settings

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import *
from .serializers import *

class CustomUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDetailsSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if settings.REQUIRE_USER_INVITE:
            return InvitedRegisterSerializer
        return RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user = user)
        return Response({ "token": token.key }, status = status.HTTP_201_CREATED)

