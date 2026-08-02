from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from http import HTTPStatus, HTTPMethod
from .models import MovieModel
from .serializers import MovieSerializer
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
    