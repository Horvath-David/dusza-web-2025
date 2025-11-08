from django.contrib.auth.models import User
from django.db import models
from django.db.models import ForeignKey, OneToOneField

CARD_TYPES = (
    ('fire', 'Tűz'),
    ('earth', 'Föld'),
    ('water', 'Víz'),
    ('air', 'Levegő'),
)

DUNGEON_TYPES = (
    ('basic', 'Egyszerű talalálkozás'),
    ('small', 'Kis kazamata'),
    ('big', 'Nagy kazamata'),
)


# Create your models here.
class UserData(models.Model):
<<<<<<< HEAD
    user = ForeignKey(User, on_delete=models.CASCADE)
=======
    user = OneToOneField(User, on_delete=models.CASCADE)
>>>>>>> 4c7e475f0f6ffa5b5b153c4be0b250c459f96da7
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
    is_boss = models.BooleanField(default=False)
    owner = ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Dungeon(models.Model):
    name = models.CharField(max_length=255)
    world = ForeignKey(World, on_delete=models.CASCADE)
    type = models.CharField(choices=DUNGEON_TYPES, max_length=50)
    cards = models.ManyToManyField(Card)
    owner = ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
