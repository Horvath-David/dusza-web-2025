import json
from json import JSONDecodeError
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.core.handlers.wsgi import WSGIRequest
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from authenticate import wrappers
from api.models import UserData


# Create your views here.
@require_http_methods(["POST"])
def login(request: WSGIRequest):
    try:
        body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse({
            "status": "Error",
            "error": "Bad request"
        }, status=400)
    request.session.clear_expired()
    user = authenticate(request, username=body.get("username"), password=body.get("password"))
    if user is not None:
        auth_login(request, user)
        return JsonResponse({"status": "Ok"}, status=200)
    else:
        return JsonResponse({
            "status": "Error",
            "error": "Invalid username or password"
        }, status=403)


@require_http_methods(["GET"])
def logout(request: WSGIRequest):
    request.session.clear_expired()
    auth_logout(request)
    return JsonResponse({"status": "Ok"}, status=200)


@require_http_methods(["POST"])
def register(request: WSGIRequest, invite_code):
    try:
        body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse({"error": "Bad request"}, status=400)

    request.session.clear_expired()
    if not body.get("username") or not body.get("password") or not body.get("display_name"):
        return JsonResponse({
            "status": "Error",
            "error": "Nem töltötted ki az összes mezőt"
        }, status=400)
    try:
        new_user = User.objects.create_user(
            username=body.get("username"),
            password=body.get("password"),
            is_staff=False
        )
    except IntegrityError:
        return JsonResponse({
            "status": "Error",
            "error": "Ez a felhasználónév már foglalt"
        }, status=409)

    UserData.objects.create(
        user=new_user,
        display_name=body.get("display_name")
    )

    auth_login(request, new_user)

    return JsonResponse({"status": "Ok"}, status=200)


@wrappers.login_required()
@require_http_methods(["GET"])
def me(request: WSGIRequest):
    return JsonResponse({
        "status": "Ok",
        "user": {
            "id": request.user.id,
            "username": request.user.username,
            "display_name": UserData.objects.get(user=request.user).display_name
        }
    }, status=200)
