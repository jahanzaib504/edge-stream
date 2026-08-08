from .views import MovieView, movie_click, movie_rating, watch_session, get_recommendations
from django.urls import path
urlpatterns = [path('<str:movie_id>', MovieView.as_view()), 
               path('click', movie_click), 
               path('rate', movie_rating),
               path('watch', watch_session),
               path('recommendations', get_recommendations)
               ]