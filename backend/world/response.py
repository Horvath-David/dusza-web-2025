import json
from json import JSONDecodeError

from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from api.models import World, UserData, Card, Dungeon
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


@wrappers.login_required()
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
            "owner": UserData.objects.get(user=i.owner).display_name if i.owner else "Törölt felhasználó",
            "is_public": i.is_public,
            "is_playable": i.is_playable
        } for i in worlds]
    })


@wrappers.login_required()
@require_http_methods(["GET"])
def get_cards_per_world(request: WSGIRequest, world_id):
    if not World.objects.filter(id=world_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a világ nem létezik"
        }, status=404)

    world_obj = World.objects.get(id=world_id)
    cards = Card.objects.filter(world=world_obj)

    return JsonResponse({
        "status": "Ok",
        "cards": [{
            "id": i.id,
            "name": i.name,
            "hp": i.hp,
            "attack": i.attack,
            "type": i.type,
            "is_boss": i.is_boss
        } for i in cards]
    })


@wrappers.login_required()
@require_http_methods(["GET"])
def get_dungeon_per_world(request: WSGIRequest, world_id):
    if not World.objects.filter(id=world_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a világ nem létezik"
        }, status=404)
    world_obj = World.objects.get(id=world_id)
    dungeons = Dungeon.objects.filter(world=world_obj)

    return JsonResponse({
        "status": "Ok",
        "dungeons": [{
            "name": i.name,
            "type": i.type,
            "cards": [{
                "name": x.name,
                "hp": x.hp,
                "attack": x.attack,
                "type": x.type,
            } for x in i.cards.all()],
        } for i in dungeons]
    })
