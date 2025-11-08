from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.UserData)
admin.site.register(models.Card)
admin.site.register(models.World)
admin.site.register(models.Dungeon)
