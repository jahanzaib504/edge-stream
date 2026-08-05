import django.forms.fields as Fields
from django.forms import ModelForm
from .models import MovieModel
from .services.aws import save_to_s3
class AdminMovieForm(ModelForm):
    video_file = Fields.FileField()
    poster_file = Fields.FileField()
    
    class Meta:
        model = MovieModel
        fields = "__all__"
        
        
        
        