from django.urls import path

from card import response

urlpatterns = [
    path('create', response.create_card, name='create_card'),
    path('<int:card_id>/update', response.edit_card, name='update_card'),
    path('<int:card_id>/delete', response.delete_card, name='delete_card'),
]
