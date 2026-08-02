from django.db import models
import uuid
from django.contrib.postgres.fields import ArrayField


class MovieModel(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        primary_key=True
    )

    movie_title = models.CharField(max_length=200)
    movie_poster_url = models.URLField()
    movie_description = models.TextField()
    movie_video_url = models.URLField()

    movie_cast = models.JSONField(default=list)

    movie_duration = models.FloatField(default=0)

    average_rating = models.FloatField(default=0)

    average_engagement = models.FloatField(default=0)

    total_views = models.IntegerField(default=0)

    genres = ArrayField(
        models.CharField(max_length=30),
        size=10,
        blank=True,
        default=list
    )