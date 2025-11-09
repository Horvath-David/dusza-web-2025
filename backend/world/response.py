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
@require_http_methods(["DELETE"])
def delete_world(request: WSGIRequest, world_id):
    if not World.objects.filter(id=world_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a világ nem létezik"
        }, status=404)
    world_obj = World.objects.get(id=world_id)
    if world_obj.owner != request.user:
        return JsonResponse({
            "status": "Error",
            "error": "Ez nem a te világod"
        }, status=403)
    world_obj.delete()
    return JsonResponse({
        "status": "Ok"
    }, status=200)


@wrappers.login_required()
@require_http_methods(["PATCH"])
def edit_world(request: WSGIRequest, world_id):
    if not World.objects.filter(id=world_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a világ nem létezik"
        }, status=404)

    world_obj = World.objects.get(id=world_id)
    if world_obj.owner != request.user:
        return JsonResponse({
            "status": "Error",
            "Error": "Ez nem a te világod"
        }, status=403)

    try:
        body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse({"error": "Bad request"}, status=400)

    additional_message = "Sikeres mentés"

    if body.get("name"):
        world_obj.name = body.get("name")
    if body.get("is_public") is not None:
        world_obj.is_public = body.get("is_public")
    if body.get("is_playable") is not None:
        world_obj.is_playable = body.get("is_playable")
    if body.get("player_cards"):
        if len(set(body.get("player_cards"))) == len(body.get("player_cards")):
            cards = []
            dirty = False
            for i in body.get("player_cards"):
                if Card.objects.filter(id=i, world=world_obj).exists():
                    cards.append(Card.objects.get(id=i))
                else:
                    dirty = True
                    break
            if not dirty:
                world_obj.player_cards = cards
                additional_message = "A játékos kártyák nem kerültek mentésre mert nem létező kártya volt a listában"

        else:
            additional_message = "A játékos kártyák nem kerültek mentésre mert duplikátum volt a listában"
    world_obj.save()
    return JsonResponse({
        "status": "Ok",
        "message": additional_message,
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
            "is_playable": i.is_playable,
            "dungeons": Dungeon.objects.filter(world=i).count(),
            "cards": Card.objects.filter(world=i).count(),
            "player_cards": [{
                "id": x.id,
                "name": x.name,
                "hp": x.hp,
                "attack": x.attack,
                "type": x.type,
            } for x in Card.objects.filter(id__in=i.player_cards)],
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
            "is_playable": i.is_playable,
            "dungeons": Dungeon.objects.filter(world=i).count(),
            "cards": Card.objects.filter(world=i).count(),
            "player_cards": [{
                "id": x.id,
                "name": x.name,
                "hp": x.hp,
                "attack": x.attack,
                "type": x.type,
            } for x in Card.objects.filter(id__in=i.player_cards)],
        } for i in worlds]
    })


@wrappers.login_required()
@require_http_methods(["GET"])
def get_world_by_id(request: WSGIRequest, world_id):
    if not World.objects.filter(id=world_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a világ nem létezik"
        }, status=404)

    world_obj = World.objects.get(id=world_id)
    return JsonResponse({
        "status": "Ok",
        "world": {
            "id": world_obj.id,
            "name": world_obj.name,
            "owner": UserData.objects.get(user=world_obj.owner).display_name if world_obj.owner else "Törölt felhasználó",
            "is_playable": world_obj.is_playable,
            "is_public": world_obj.is_public,
            "dungeons": Dungeon.objects.filter(world=world_obj).count(),
            "cards": Card.objects.filter(world=world_obj).count(),
            "player_cards": [{
                "id": i.id,
                "name": i.name,
                "hp": i.hp,
                "attack": i.attack,
                "type": i.type,
            } for i in Card.objects.filter(id__in=world_obj.player_cards)],
        }
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
            "id": i.id,
            "name": i.name,
            "type": i.type,
            "cards": [{
                "id": x.id,
                "name": x.name,
                "hp": x.hp,
                "attack": x.attack,
                "type": x.type,
                "is_boss": x.is_boss,
            } for x in i.cards.all().order_by("order")],
        } for i in dungeons]
    })
