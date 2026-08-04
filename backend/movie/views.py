from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from http import HTTPStatus, HTTPMethod
from .models import MovieModel, MovieClick, MovieRating
from .serializers import MovieSerializer, WatchSessionSerializer
from django.shortcuts import get_object_or_404
# Create your views here.
@api_view([HTTPMethod.GET])
# @permission_classes([IsAuthenticated])
def get_movie(request: Request):
    movie_id = request.query_params.get('movie_id', '')
    if not movie_id:
        return Response({"message": "Please specify a movie id"}, HTTPStatus.BAD_REQUEST)
    movie = movie = get_object_or_404(MovieModel, id=movie_id)
    
    serializer = MovieSerializer(movie)
    return Response(serializer.data)
    
@api_view([HTTPMethod.POST])
@permission_classes([IsAuthenticated])   
def movie_click(request: Request):
    user = request.user
    movie_id = request.data.get('movie_id')
    
    if not movie_id:
        return Response({"message": "Missing movie_id"}, HTTPStatus.BAD_REQUEST)
    try:
        MovieClick.objects.create(user_id=user.id, movie_id=movie_id)
    except Exception as e:
        return Response({"message": e}, HTTPStatus.BAD_REQUEST)
    return Response(status=HTTPStatus.OK)

@api_view([HTTPMethod.POST])
@permission_classes([IsAuthenticated])   
def move_rating(request: Request):
    user = request.user
    movie_id = request.data.get('movie_id')
    rating = request.data.get('rating')
    if not movie_id:
        return Response({"message": "Missing movie_id"}, HTTPStatus.BAD_REQUEST)
    try:
        MovieRating.objects.create(user_id=user.id, movie_id=movie_id, rating=rating)
    except Exception as e:
        return Response({"message": e}, HTTPStatus.BAD_REQUEST)
    return Response(status=HTTPStatus.OK)

@api_view([HTTPMethod.POST])
@permission_classes([IsAuthenticated])   
def watch_session(request: Request):
    user = request.user
    
    serializer = WatchSessionSerializer(request.data)
    if not serializer.is_valid():
        return Response({"message", serializer.errors}, HTTPStatus.BAD_REQUEST)
    
    try:
        serializer.save()
    except Exception as e:
        return Response({"message": e}, HTTPStatus.BAD_REQUEST)
    return Response(status=HTTPStatus.OK)