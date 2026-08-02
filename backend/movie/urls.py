from .views import get_movie
from django.urls import path
urlpatterns = [path('', get_movie)]