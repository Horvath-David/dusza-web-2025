import json
from json import JSONDecodeError
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


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
