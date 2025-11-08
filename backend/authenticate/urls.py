from django.urls import path
from . import response
import api.urls

urlpatterns = [
    path("login", response.login, name="login"),
    path("logout", response.logout, name="logout"),
    path("register", response.register, name="register"),
    path("me", response.me, name="me"),
]
