from rest_framework import serializers
from .models import MovieModel, MovieClick, SearchHistory, WatchSession, MovieRating, Genre
from django.core.files.storage import default_storage
# This custom field appends s3 url when reading otherwise does not
class URLFieldCustom(serializers.URLField):
    def to_representation(self, value):
        if not value:
            return None
        return default_storage.url(value)

    def to_internal_value(self, data):
        return super().to_internal_value(data)
    
    
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]
        
class MovieSerializer(serializers.ModelSerializer):
    video_url = URLFieldCustom()
    poster_url = URLFieldCustom()
    genres = GenreSerializer(many=True, read_only=True)
    class Meta:
        model = MovieModel
        fields = "__all__"

class MovieClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieClick
        fields = "__all__"

class MovieRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieRating
        fields = "__all__"

class WatchSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchSession
        fields = "__all__"
class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = "__all__"
        
        
