import os
import tempfile

from django.contrib import admin
from django.core.exceptions import ValidationError
from moviepy import VideoFileClip

from .forms import AdminMovieForm
from .models import MovieModel, Genre
from .services.aws import save_to_s3
from django.core.files.storage import default_storage
import uuid
@admin.register(MovieModel)
class MovieAdmin(admin.ModelAdmin):
    form = AdminMovieForm
    readonly_fields = [
        "duration",
        "video_url",
        "poster_url",
        "average_rating",
        "average_engagement",
        "total_views",
    ]

    def save_model(self, request, obj, form, change):
        uploaded_video_file = form.cleaned_data.get('video_file')
        uploaded_poster_file = form.cleaned_data.get('poster_file')

        if not uploaded_video_file or not uploaded_poster_file:
            raise ValidationError("Both video_file and poster_file are required.")

        # Write the video to a genuinely local temp file so moviepy can read
        # its duration. default_storage is S3-backed now, so we bypass it here.
        suffix = os.path.splitext(uploaded_video_file.name)[1]
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            for chunk in uploaded_video_file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name

        clip = None
        try:
            clip = VideoFileClip(tmp_path)
            duration = clip.duration
        except Exception as e:
            raise ValidationError(f"Could not process video file: {e}")
        finally:
            if clip is not None:
                clip.close()
            os.remove(tmp_path)

        # Reset the file pointer before uploading to S3, since .chunks()
        # already consumed the stream once.
        uploaded_video_file.seek(0)
        uploaded_poster_file.seek(0)


        video_name = f"videos/{uuid.uuid4()}_{uploaded_video_file.name}"
        poster_name = f"posters/{uuid.uuid4()}_{uploaded_poster_file.name}"

        obj.video_url = default_storage.save(
            video_name,
            uploaded_video_file
        )

        obj.poster_url = default_storage.save(
            poster_name,
            uploaded_poster_file
        )
        obj.duration = duration
        obj.save()


admin.site.register(Genre)