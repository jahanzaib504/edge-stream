from .models import UserModel
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

class RegisterSerializer(ModelSerializer):
    username = serializers.CharField(max_length=100, min_length=1)
    email = serializers.EmailField(max_length=100)
    password = serializers.CharField(max_length=100, min_length=6, write_only=True)
    class Meta:
        model = UserModel
        fields = ["username", "email", "password"]
    def create(self, validated_data):
        # Hash the password before saving to the database
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=100, min_length=1)
    password = serializers.CharField(max_length=100, min_length=6)
    
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['username', 'id', 'email', 'is_verified', 'is_superuser']