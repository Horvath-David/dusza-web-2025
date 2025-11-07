from django.contrib.auth.models import User
from django.db import models
from django.db.models import ForeignKey


# Create your models here.
class UserData(models.Model):
    user = ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}'s data"
