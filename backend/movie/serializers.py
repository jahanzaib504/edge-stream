from rest_framework import serializers
from .models import MovieModel


class MovieSerializer(serializers.ModelSerializer):

    movie_cast = serializers.ListField(
        child=serializers.CharField(max_length=100),
        max_length=5
    )

    genres = serializers.ListField(
        child=serializers.CharField(max_length=30),
        max_length=10,
        required=False
    )

    class Meta:
        model = MovieModel
        fields = "__all__"