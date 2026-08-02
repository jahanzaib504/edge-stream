from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
# Create your models here.
# Models define the type of data that i expect. This must be serialzed into python dictionary
class UserModel(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=100, unique=True)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    