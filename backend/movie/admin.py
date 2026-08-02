from django.contrib import admin

# Register your models here.
from .views import MovieModel
admin.site.register(MovieModel)