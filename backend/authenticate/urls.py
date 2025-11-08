from django.urls import path
from . import response
import api.urls

urlpatterns = [
    path("login", response.login, name="login"),
    path("logout", response.logout, name="logout"),
    path("register", response.register, name="register"),
<<<<<<< HEAD
=======
    path("me", response.me, name="me"),
>>>>>>> 4c7e475f0f6ffa5b5b153c4be0b250c459f96da7
]
