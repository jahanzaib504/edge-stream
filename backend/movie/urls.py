from .views import get_movie, movie_click, move_rating, watch_session
from django.urls import path
urlpatterns = [path('', get_movie), 
               path('click', movie_click), 
               path('rate', move_rating),
               path('watch', watch_session)
               ]