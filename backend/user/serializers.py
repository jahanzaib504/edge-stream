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
        fields = "__all__"
    def create(self, validated_data):
        # Hash the password before saving to the database
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=100, min_length=1)
    password = serializers.CharField(max_length=100, min_length=6)
    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        if not user.is_active:
            raise serializers.ValidationError("This account is disabled")
        
        attrs['user'] = user
        return attrs