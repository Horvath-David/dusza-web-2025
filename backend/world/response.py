import json
from json import JSONDecodeError

from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from api.models import World, UserData
from authenticate import wrappers
# Create your views here.


@wrappers.login_required()
@require_http_methods(["POST"])
def create_world(request: WSGIRequest):
    try:
        body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse({"error": "Bad request"}, status=400)

    world_obj = World.objects.create(
        name=body.get("name"),
        owner=request.user,
        is_public=False,
        is_playable=False,
    )

    return JsonResponse({
        "status": "Ok",
        "id": world_obj.id
    }, status=200)


@require_http_methods(["GET"])
def get_worlds(request: WSGIRequest):
    worlds = World.objects.filter(is_public=True)
    return JsonResponse({
        "status": "Ok",
        "worlds": [{
            "id": i.id,
            "name": i.name,
            "owner": UserData.objects.get(user=request.user).display_name,
            "is_playable": i.is_playable
        } for i in worlds]
    })


@wrappers.login_required()
@require_http_methods(["GET"])
def get_my_worlds(request: WSGIRequest):
    worlds = World.objects.filter(owner=request.user)
    return JsonResponse({
        "status": "Ok",
        "worlds": [{
            "id": i.id,
            "name": i.name,
            "owner": UserData.objects.get(user=request.user).display_name,
            "is_public": i.is_public,
            "is_playable": i.is_playable
        } for i in worlds]
    })
