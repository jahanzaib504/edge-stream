from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import LoginSerializer, RegisterSerializer
from .utils.token import get_token_user
from django.db import IntegrityError

# Create your views here.
@api_view(['GET', 'POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"message": serializer.errors}, status=400)
    try:
        user = serializer.save()
    except IntegrityError as e:
        return Response({"message": "This user or email already exists"}, status=403)
    
    # Generate token for user
    tokens = get_token_user(user)
    return Response(tokens, status=200)

@api_view(['GET', 'POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"message": serializer._errors}, status=400)
    user = serializer.validated_data.get('user')
    tokens = get_token_user(user)
    return Response(tokens, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    return

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def test(request):
    return Response("working")