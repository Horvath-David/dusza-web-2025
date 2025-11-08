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
    user = OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.username}'s data"


class World(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True
    )
    owner = ForeignKey(User, on_delete=models.SET_NULL, null=True)
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
    owner = ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class Dungeon(models.Model):
    name = models.CharField(max_length=255)
    world = ForeignKey(World, on_delete=models.CASCADE)
    type = models.CharField(choices=DUNGEON_TYPES, max_length=50)
    cards = models.ManyToManyField(Card, null=True, blank=True)
    owner = ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class GameState(models.Model):
    world = ForeignKey(World, on_delete=models.CASCADE)
    user = ForeignKey(User, on_delete=models.CASCADE)
    state = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s state on world \"{self.world.name}\""
