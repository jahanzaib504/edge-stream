from .views import register_user, login_user, logout_user, test, get_me, get_email_verification_link, verify_email, update_profile, delete_user
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('register', register_user),
    path('login', login_user),
    path('logout', logout_user),
    path('me', get_me),
    path('token', TokenObtainPairView.as_view()),
    path('refresh', TokenRefreshView.as_view()),
    path('test', test),
    path('generate-verification-link/', get_email_verification_link, name="generate-verification-link"),
    path('verify-email/', verify_email),
    path('/delete', delete_user),
    path('/update', update_profile)
]