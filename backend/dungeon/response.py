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


def handle_cards(card_ids, body: dict):
    dungeon_type = body.get("type")

    if len(card_ids) != MAX_CARDS[dungeon_type]:
        return False, f"Nem a megfelelő mennyiségű kártyát választottad ki. Ehhez a típushoz szükséges: {MAX_CARDS[dungeon_type]} darab"

    if NEEDS_BOSS[dungeon_type]:
        if not Card.objects.filter(id=card_ids[-1], is_boss=True).exists():
            return False, "Nincsen vezérkártya vagy nem az utolsó helyen van"

    card_objs = []
    for idx, card_id in enumerate(card_ids):
        card_obj = Card.objects.get(id=card_id)
        card_obj.order = idx
        card_obj.save()
        card_objs.append(card_obj)

    return True, card_objs


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

    if len(set(card_ids)) != len(card_ids):
        return JsonResponse({
            "status": "Error",
            "error": "Egy kártya csak egyszer szerepelhet egy kazamatában"
        }, status=400)

    for i in card_ids:
        if not Card.objects.filter(id=i, world=world_obj).exists():
            return JsonResponse({
                "status": "Error",
                "error": "Egy vagy több megadott kártya nem létezik ebben a világban"
            }, status=400)

    success, result = handle_cards(card_ids, body)
    if not success:
        return JsonResponse({"status": "Error", "error": result}, status=400)
    card_objs = result

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
@require_http_methods(["DELETE"])
def delete_dungeon(request: WSGIRequest, dungeon_id):
    if not Dungeon.objects.filter(id=dungeon_id).exists():
        return JsonResponse({
            "staus": "Error",
            "error": "Ez a kazamata nem létezik"
        }, status=404)
    dungeon_obj = Dungeon.objects.get(id=dungeon_id)
    if dungeon_obj.owner != request.user:
        return JsonResponse({
            "status": "Error",
            "error": "Ez nem a te kazamatád"
        }, status=403)

    if dungeon_obj.world.is_public:
        return JsonResponse({
            "status": "Error",
            "error": "Ehhez a kazamatához tartozó világ már publikus"
        }, status=403)

    dungeon_obj.delete()
    return JsonResponse({
        "status": "Ok"
    }, status=200)


@wrappers.login_required()
@require_http_methods(["POST", "PATCH"])
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

    if dungeon_obj.world.is_public:
        return JsonResponse({
            "status": "Error",
            "error": "Ehhez a kazamatához tartozó világ már publikus"
        }, status=403)

    if body.get("name"):
        dungeon_obj.name = body.get("name")
    if body.get("type") and body.get("type") in dict(DUNGEON_TYPES).keys():
        dungeon_obj.type = body.get("type")
    if body.get("cards"):
        card_ids = body.get("cards")

        if len(set(card_ids)) != len(card_ids):
            return JsonResponse({
                "status": "Error",
                "error": "Egy kártya csak egyszer szerepelhet egy kazamatában"
            }, status=400)

        for i in card_ids:
            if not Card.objects.filter(id=i, world=dungeon_obj.world).exists():
                return JsonResponse({
                    "status": "Error",
                    "error": "Egy vagy több megadott kártya nem létezik ebben a világban"
                }, status=400)

        success, result = handle_cards(card_ids, body)
        if not success:
            return JsonResponse({"status": "Error", "error": result}, status=400)
        card_objs = result

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
                "is_boss": i.is_boss,
            } for i in dungeon_obj.cards.all().order_by("order")]
        }
    })
