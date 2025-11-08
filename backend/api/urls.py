from django.urls import path, include

import authenticate.urls, world.urls


urlpatterns = [
    path('auth/', include(authenticate.urls)),
    path('world/', include(world.urls)),
]
