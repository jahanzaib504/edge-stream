import django.forms.fields as Fields
from django.forms import ModelForm
from .models import MovieModel
from .services.aws import save_to_s3
from django.core.validators import FileExtensionValidator
class AdminMovieForm(ModelForm):
    video_file = Fields.FileField(validators=[FileExtensionValidator(['mp4'])])
    poster_file = Fields.FileField(validators=[FileExtensionValidator(['jpeg', 'jpg', 'png'])])
    
    class Meta:
        model = MovieModel
        fields = '__all__'
        
        
        
        
        