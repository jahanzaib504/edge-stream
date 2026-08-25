from .views import MovieView, movie_click, movie_rating, watch_session, get_recommendations, get_presigned_url, get_genres
from django.urls import path
urlpatterns = [
               path('presigned_url', get_presigned_url),
               path('genres', get_genres),
               path('recommendations', get_recommendations),
               path('click', movie_click), 
               path('rate', movie_rating),
               path('watch', watch_session),
               path('', MovieView.as_view()),
               path('m/<str:movie_id>', MovieView.as_view()), 
               ]