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
        if not Card.objects.filter(id=i).exists():
            return JsonResponse({
                "status": "Error",
                "error": "Egy vagy több megadott kártya nem létezik"
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

    card_objs = [card for card in Card.objects.filter(id__in=card_ids)]

    dungeon_obj = Dungeon.objects.create(
        name=body.get("name"),
        world=world_obj,
        type=body.get("type"),
        owner=request.user,
    )

    dungeon_obj.cards.add(*card_objs)

    return JsonResponse({
        "status": "Ok",
        "dungeon_id": dungeon_obj.id
    }, status=200)
