from rest_framework import serializers
from .models import MovieModel, MovieClick, SearchHistory, WatchSession, MovieRating


class MovieSerializer(serializers.ModelSerializer):
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