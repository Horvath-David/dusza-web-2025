from django.urls import path

from game_state import response

urlpatterns = [
    path('save', response.save_game_state, name='save_game_state'),
    path('<int:state_id>', response.get_game_state, name='get_game_state')
]