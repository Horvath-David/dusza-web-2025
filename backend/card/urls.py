from django.urls import path

from card import response

urlpatterns = [
    path('create', response.create_card, name='create_card')
]