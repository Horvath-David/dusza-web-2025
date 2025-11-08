from django.contrib.auth.models import User
from django.db import models
from django.db.models import ForeignKey, OneToOneField

CARD_TYPES = (
    ('fire', 'Tűz'),
    ('earth', 'Föld'),
    ('water', 'Víz'),
    ('air', 'Levegő'),
)


# Create your models here.
class UserData(models.Model):
    user = OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.username}'s data"


class World(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True
    )
    owner = ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=False)
    is_playable = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Card(models.Model):
    name = models.CharField(max_length=16)
    hp = models.IntegerField()
    attack = models.IntegerField()
    type = models.CharField(choices=CARD_TYPES, max_length=50)
    world = ForeignKey(World, on_delete=models.CASCADE)
    owner = ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
