

# Whenever a movie is deleted its videos and posters automatically deletes from s3
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.core.files.storage import default_storage
from .models import MovieModel
@receiver(post_delete, sender=MovieModel)
def movie_deleted(sender, instance: MovieModel, **kwargs):
    # The instance is a movie model so we extract the video and poster url
    video_url = instance.video_url
    poster_url = instance.poster_url
    try:
        default_storage.delete(video_url)
        default_storage.delete(poster_url)
        print("Files deleted from s3 successfully")
    except Exception as e:
        print("An unknown exception occured while deleting e: ", e)