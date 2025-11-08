from django.urls import path, include

import authenticate.urls, world.urls, card.urls, dungeon.urls, game_state.urls


urlpatterns = [
    path('auth/', include(authenticate.urls)),
    path('world/', include(world.urls)),
    path('card/', include(card.urls)),
    path('dungeon/', include(dungeon.urls)),
    path('state/', include(game_state.urls)),
]
