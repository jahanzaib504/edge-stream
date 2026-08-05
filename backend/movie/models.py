from django.db import models
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator

from user.models import UserModel


class Genre(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name


class MovieModel(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    title = models.CharField(max_length=200)
    poster_url = models.URLField(blank=True)
    description = models.TextField()
    video_url = models.URLField(blank=True)

    
    cast = models.JSONField(default=list, blank=True)

    duration = models.FloatField(default=0)

    average_rating = models.FloatField(default=0)
    average_engagement = models.FloatField(default=0)
    total_views = models.PositiveIntegerField(default=0)

    genres = models.ManyToManyField(
        Genre,
        related_name="movies",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class MovieRating(models.Model):
    user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name="movie_ratings"
    )

    movie = models.ForeignKey(
        MovieModel,
        on_delete=models.CASCADE,
        related_name="ratings"
    )

    rating = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "movie"],
                name="unique_movie_rating"
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.movie} ({self.rating})"


class MovieClick(models.Model):
    user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name="movie_clicks"
    )

    movie = models.ForeignKey(
        MovieModel,
        on_delete=models.CASCADE,
        related_name="clicks"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} clicked {self.movie}"


class SearchHistory(models.Model):
    user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name="search_history"
    )

    searched_text = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}: {self.searched_text}"


class WatchSession(models.Model):
    user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name="watch_sessions"
    )

    movie = models.ForeignKey(
        MovieModel,
        on_delete=models.CASCADE,
        related_name="watch_sessions"
    )

    watch_duration = models.PositiveIntegerField(
        help_text="Time watched in seconds."
    )

    completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} watched {self.movie}"