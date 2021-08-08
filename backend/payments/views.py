from django.shortcuts import render
from django.core.mail import send_mail

from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from payments.models import *
from payments.serializers import *

from datetime import timedelta
from common.coinpayments import api as cpapi
import json

@api_view(["POST"])
def coinpayments_ipn(request):
    """
    A webhook to handle payment notifications from CoinPayments.
    Documentation: https://www.coinpayments.net/merchant-tools-ipn
    """
    
    ipn_type = request.data.get("ipn_type")
    if ipn_type is None:
        return Response(status = status.HTTP_400_BAD_REQUEST)

    if ipn_type == "api":

        # https://www.coinpayments.net/merchant-tools-ipn#statuses
        pstatus = int(request.data.get("status", coinpayments.MISSING_STATUS))
        if pstatus == coinpayments.MISSING_STATUS:
            return Response(status = status.HTTP_400_BAD_REQUEST)

        if pstatus == coinpayments.PAYMENT_COMPLETE:
            # fulfill an order i guess?
            pass
        
    send_mail(
        f"coinpayments ipn: {ipn_type}",
        json.dumps(request.data, indent = 4),
        "dev@hayste.co",
        ["justin@garofolo.net"]
    )
    return Response(status = status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def purchase_vip(request):

    plan = request.data.get("plan")
    if not plan:
        return Response(status = status.HTTP_400_BAD_REQUEST)

    plans = {
        "t1": {
            "threads": 10,
            "duration": timedelta(weeks = 4),
            "amount": 1
        },
        "t2": {
            "threads": 50,
            "duration": timedelta(weeks = 4),
            "amount": 1.50
        },
        "t3": {
            "threads": 100,
            "duration": timedelta(weeks = 4),
            "amount": 2
        }
    }
    plan_data = plans[plan]

    txn = cpapi.create_transaction(plan_data["amount"], request.user.email)
    purchase = VIPPurchase.objects.create(user = request.user, txn_id = txn["txn_id"], **plan_data)
    serializer = VIPPurchaseSerializer(purchase)
    print(txn)
    return Response(serializer.data, status = status.HTTP_200_OK)

