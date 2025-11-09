from django.urls import path

from dungeon import response

urlpatterns = [
    path("create", response.create_dungeon, name="create_dungeon"),
    path("<int:dungeon_id>/update", response.edit_dungeon, name="edit_dungeon"),
    path("<int:dungeon_id>/delete", response.delete_dungeon, name="delete_dungeon"),
    path("get/<int:dungeon_id>", response.get_dungeon_by_id, name="get_dungeon_by_id"),
]
