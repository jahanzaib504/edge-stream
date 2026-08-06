from django.contrib import admin
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from moviepy import VideoFileClip

from .forms import AdminMovieForm
from .models import MovieModel, Genre
from .services.aws import save_to_s3


@admin.register(MovieModel)
class MovieAdmin(admin.ModelAdmin):
    form = AdminMovieForm
    readonly_fields = [
        "duration",
        "video_url",
        "poster_url",
        "average_rating",
        "average_engagement",
        "total_views"
    ]
    def save_model(self, request, obj, form, change):
        uploaded_video_file = form.cleaned_data.get('video_file')
        uploaded_poster_file = form.cleaned_data.get('poster_file')

        if not uploaded_video_file or not uploaded_poster_file:
            raise ValidationError("Both video_file and poster_file are required.")

        # Save the video file locally (temporarily) so moviepy can read its duration
        file_name = default_storage.save(uploaded_video_file.name, uploaded_video_file)
        file_path = default_storage.path(file_name)

        clip = None
        try:
            clip = VideoFileClip(file_path)
            duration = clip.duration
        except Exception as e:
            raise ValidationError(f"Could not process video file: {e}")
        finally:
            if clip is not None:
                clip.close()
            # Clean up the temporary local copy
            default_storage.delete(file_name)

        # Reset file pointers before re-reading them for the S3 upload,
        # since default_storage.save() already consumed the stream.
        uploaded_video_file.seek(0)
        uploaded_poster_file.seek(0)

        obj.video_url = save_to_s3(uploaded_video_file)
        obj.poster_url = save_to_s3(uploaded_poster_file)
        obj.duration = duration
        obj.save()


admin.site.register(Genre)