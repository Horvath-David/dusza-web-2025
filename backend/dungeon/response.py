import json
from json import JSONDecodeError

from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from api.models import World, Dungeon, DUNGEON_TYPES, Card
from authenticate import wrappers

# Create your views here.

MAX_CARDS = {
    "basic": 1,
    "small": 4,
    "big": 6,
}

NEEDS_BOSS = {
    "basic": False,
    "small": True,
    "big": True,
}


@wrappers.login_required()
@require_http_methods(["POST"])
def create_dungeon(request: WSGIRequest):
    try:
        body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse({"error": "Bad request"}, status=400)

    if not World.objects.filter(id=body.get("world_id")).exists():
        return JsonResponse({
            "status": "Error",
            "error": "A megadott világ nem létezik",
        }, status=400)
    world_obj = World.objects.get(id=body.get("world_id"))

    if body.get("type") not in dict(DUNGEON_TYPES).keys():
        return JsonResponse({
            "status": "Error",
            "error": "Helytelen kazamata típus"
        })

    card_ids = body.get("cards")

    for i in card_ids:
        if not Card.objects.filter(id=i, world=world_obj).exists():
            return JsonResponse({
                "status": "Error",
                "error": "Egy vagy több megadott kártya nem létezik ebben a világban"
            }, status=400)

    if len(card_ids) != MAX_CARDS[body.get("type")]:
        return JsonResponse({
            "status": "Error",
            "error": f"Nem a megfelelő mennyiségű kártyát választottad ki. Ehhez a típushoz szükságes: {MAX_CARDS[body.get("type")]} darab"
        }, status=400)

    if NEEDS_BOSS[body.get("type")]:
        if not Card.objects.filter(id=card_ids[-1], is_boss=True).exists():
            return JsonResponse({
                "status": "Error",
                "error": "Nincsen vezérkártya vagy nem az utolsó helyen van"
            }, status=400)

    card_objs = []
    for idx, card_id in enumerate(card_ids):
        card_obj = Card.objects.get(id=card_id)
        card_obj.order = idx
        card_obj.save()
        card_objs.append(card_obj)

    dungeon_obj = Dungeon.objects.create(
        name=body.get("name"),
        world=world_obj,
        type=body.get("type"),
        owner=request.user,
    )

    dungeon_obj.cards.add(*card_objs)

    return JsonResponse({
        "status": "Ok",
        "id": dungeon_obj.id
    }, status=200)


@wrappers.login_required()
@require_http_methods(["POST"])
def edit_dungeon(request: WSGIRequest, dungeon_id):
    if not Dungeon.objects.filter(id=dungeon_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a kazamata nem létezik"
        }, status=404)

    try:
        body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse({"error": "Bad request"}, status=400)

    dungeon_obj = Dungeon.objects.get(id=dungeon_id)
    if dungeon_obj.owner != request.user:
        return JsonResponse({
            "status": "Error",
            "error": "Ez nem a te kazamatád"
        }, status=403)

    if body.get("name"):
        dungeon_obj.name = body.get("name")
    if body.get("type") and body.get("type") in dict(DUNGEON_TYPES).keys():
        dungeon_obj.type = body.get("type")
    if body.get("cards"):
        card_ids = body.get("cards")

        for i in card_ids:
            if not Card.objects.filter(id=i, world=dungeon_obj.world).exists():
                return JsonResponse({
                    "status": "Error",
                    "error": "Egy vagy több megadott kártya nem létezik ebben a világban"
                }, status=400)

        if len(card_ids) != MAX_CARDS[body.get("type")]:
            return JsonResponse({
                "status": "Error",
                "error": f"Nem a megfelelő mennyiségű kártyát választottad ki. Ehhez a típushoz szükságes: {MAX_CARDS[body.get("type")]} darab"
            }, status=400)

        if NEEDS_BOSS[body.get("type")]:
            if not Card.objects.filter(id=card_ids[-1], is_boss=True).exists():
                return JsonResponse({
                    "status": "Error",
                    "error": "Nincsen vezérkártya vagy nem az utolsó helyen van"
                }, status=400)

        card_objs = []
        for idx, card_id in enumerate(card_ids):
            card_obj = Card.objects.get(id=card_id)
            card_obj.order = idx
            card_obj.save()
            card_objs.append(card_obj)

        dungeon_obj.cards.clear()
        dungeon_obj.cards.add(*card_objs)

    dungeon_obj.save()

    return JsonResponse({
        "status": "Ok"
    }, status=200)


@wrappers.login_required()
@require_http_methods(["GET"])
def get_dungeon_by_id(request: WSGIRequest, dungeon_id):
    if not Dungeon.objects.filter(id=dungeon_id):
        return JsonResponse({
            "status": "Error",
            "error": "Ez a kazamata nem létezik"
        }, status=404)

    dungeon_obj = Dungeon.objects.get(id=dungeon_id)

    return JsonResponse({
        "status": "Ok",
        "dungeon": {
            "id": dungeon_obj.id,
            "name": dungeon_obj.name,
            "type": dungeon_obj.type,
            "cards": [{
                "id": i.id,
                "name": i.name,
                "hp": i.hp,
                "attack": i.attack,
                "type": i.type,
            } for i in dungeon_obj.cards.all().order_by("order")]
        }
    })
