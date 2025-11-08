import json
from json import JSONDecodeError

from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from authenticate import wrappers
from api.models import Card, World, CARD_TYPES


# Create your views here.


@wrappers.login_required()
@require_http_methods(["POST"])
def create_card(request: WSGIRequest):
    try:
        body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse({"error": "Bad request"}, status=400)

    to_create = body.get("cards")
    if not to_create:
        return JsonResponse({
            "status": "Error",
            "error": "Nem adtál meg kártyákat"
        }, status=400)

    world_id = body.get("world_id")
    if not World.objects.filter(id=world_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a világ nem létezik"
        }, status=400)

    world = World.objects.get(id=world_id)
    if world.owner != request.user:
        return JsonResponse({
            "status": "Error",
            "error": "Ez nem a te világod"
        }, status=403)

    skipped_cards = []

    for i in to_create:
        if Card.objects.filter(name=i.get("name"), world=world).exists():
            skipped_cards.append({
                "name": i.get("name"),
                "reason": "A kártya nem létezik ebben a világban"
            })
            continue

        if i.get("type") not in dict(CARD_TYPES).keys():
            skipped_cards.append({
                "name": i.get("name"),
                "reason": "Helytelen kártyatípus"
            })
            continue

        Card.objects.create(
            name=i.get("name"),
            hp=i.get("hp"),
            attack=i.get("attack"),
            type=i.get("type"),
            world=world,
            owner=request.user,
            is_boss=False
        )

    return JsonResponse({
        "status": "Ok",
        "skipped": skipped_cards,
    }, status=200)
