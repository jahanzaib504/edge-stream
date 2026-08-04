from .views import MovieView, movie_click, movie_rating, watch_session
from django.urls import path
urlpatterns = [path('', MovieView.as_view()), 
               path('click', movie_click), 
               path('rate', movie_rating),
               path('watch', watch_session)
               ]