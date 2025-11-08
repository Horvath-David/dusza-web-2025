from django.urls import path

from world import response

urlpatterns = [
    path("create", response.create_world, name="create_world"),
    path("all", response.get_worlds, name="get_all_worlds"),
    path("my", response.get_my_worlds, name="get_my_worlds"),
    path("<int:world_id>/cards", response.get_cards_per_world, name="get_cards_per_world"),
    path("<int:world_id>/dungeons", response.get_dungeon_per_world, name="get_dungeon_per_world"),
]
