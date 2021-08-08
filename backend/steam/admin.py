from django.contrib import admin, messages
from django.urls import path
from django.http import HttpResponse, HttpResponseRedirect

from .models import *

@admin.register(SteamAccount)
class SteamAccountAdmin(admin.ModelAdmin):

    change_form_template = "steamaccount_change_form.html"

    def response_change(self, request, account):
        if "_do-login" in request.POST:
            try:
                account._login()
                self.message_user(request, "Logged in successfully.", level = messages.SUCCESS)
            except Exception as ex:
                self.message_user(request, str(ex), level = messages.ERROR)
            return HttpResponseRedirect(".")
        return super().response_change(request, account)
        
admin.site.register(SteamSwap)
