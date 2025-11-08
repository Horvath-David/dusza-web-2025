from django.contrib.auth.models import User
from django.db import models
from django.db.models import ForeignKey


# Create your models here.
class UserData(models.Model):
    user = ForeignKey(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.username}'s data"
