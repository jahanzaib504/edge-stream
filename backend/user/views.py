from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer
from .utils.token import get_token_user
from django.db import IntegrityError
from .models import UserModel
import uuid
from django.utils import timezone
from rest_framework import status
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from decouple import config
from .utils.email_service import send_email
from rest_framework.request import Request
from datetime import timedelta
signer = TimestampSigner()

def generate_verification_link(user_id):
    # Generates a signed token containing user_id
    signed_token = signer.sign(user_id)
    # Landing on front-end domain 
    return f"{config("FRONT_END_DOMAIN")}/verify-email/?token={signed_token}"

# Create your views here.
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"message": serializer.errors}, status=400)
    try:
        user = serializer.save()
    except IntegrityError as e:
        print(e)
        return Response({"message": "This user or email already exists"}, status=403)
    # User data saved but is still unverified
    return Response(serializer.validated_data, status=200)


@api_view(["GET"])
def get_email_verification_link(request: Request):
    user_email = request.query_params.get("email")

    try:
        user = UserModel.objects.get(email=user_email)
    except UserModel.DoesNotExist:
        return Response(
            {"message": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    if user.is_verified:
        return Response(
            {"message": "User is already verified."},
            status=status.HTTP_200_OK
        )

    if (
        user.last_created
        and timezone.now() - user.last_created < timedelta(hours=24)
    ):
        return Response(
            {"message": "You can request another verification mail after 24 hours."},
            status=status.HTTP_403_FORBIDDEN
        )

    link = generate_verification_link(str(user.id))

    try:
        send_email(user.email, link)
    except Exception:
        return Response(
            {"message": "Failed to send verification email."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    user.last_created = timezone.now()
    user.save(update_fields=["last_created"])

    return Response(
        {"message": "Verification email sent."},
        status=status.HTTP_200_OK
    )
    

    
@api_view(['POST'])
def verify_email(request:Request):
    token = request.query_params.get('token')
    
    try:
        # Validates signature and checks if created within 24 hours
        user_id = signer.unsign(token, max_age=60*60*24)
        
        # Fetch user and activate
        user = UserModel.objects.get(pk=user_id)
        
        if user.is_verified:
            return Response({"message": "User is already verified"}, status=status.HTTP_202_ACCEPTED)
        user.is_verified = True
        user.save()
        
        return Response({"message":"Email verified successfully!"})
        
    except (BadSignature, SignatureExpired, UserModel.DoesNotExist):
        return Response("Invalid or expired link.", status=400)
    
    
@api_view(['POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {"message": serializer.errors},
            status=400
        )

    user = serializer.validated_data['user']
    
    user_data = UserSerializer(user).data
    if not user_data.get('is_verified'):
        return Response({"message": "Complete the sign up process"}, status=status.HTTP_403_FORBIDDEN)
    
    tokens = get_token_user(user)
    return Response(
        {
            "tokens": tokens,
            "user": user_data
        },
        status=200
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    return

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def test(request):
    return Response("working")

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)