from django.urls import path

from dungeon import response

urlpatterns = [
    path("create", response.create_dungeon, name="create_dungeon"),
]
