from django.contrib import admin
from .forms import AdminMovieForm
from .models import MovieModel
from .services.aws import save_to_s3
# Register your models here.
@admin.register(MovieModel)
class MovieAdmin(admin.ModelAdmin):
    form = AdminMovieForm
    def save_model(self, request, obj, form, change):
        uploaded_video_file = form.cleaned_data.get('video_file')
        uploaded_poster_file = form.cleaned_data.get('poster_file')
        obj.video_url = save_to_s3(uploaded_video_file)
        obj.poster_url = save_to_s3(uploaded_poster_file)
        obj.save()