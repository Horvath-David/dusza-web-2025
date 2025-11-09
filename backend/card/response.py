import json
from json import JSONDecodeError

from django.core.handlers.wsgi import WSGIRequest
from django.db import transaction
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
    card_ids = []

    with transaction.atomic():
        for i in to_create:
            if Card.objects.filter(name=i.get("name"), world=world).exists():
                skipped_cards.append({
                    "name": i.get("name"),
                    "reason": "A kártya már létezik ebben a világban"
                })
                continue

            if i.get("type") not in dict(CARD_TYPES).keys():
                skipped_cards.append({
                    "name": i.get("name"),
                    "reason": "Helytelen kártyatípus"
                })
                continue

            card = Card.objects.create(
                name=i.get("name"),
                hp=i.get("hp"),
                attack=i.get("attack"),
                type=i.get("type"),
                world=world,
                owner=request.user,
                is_boss=i.get("is_boss") or False,
            )

            card_ids.append(card.id)


    return JsonResponse({
        "status": "Ok",
        "skipped": skipped_cards,
        "ids": card_ids,
    }, status=200)


@wrappers.login_required()
@require_http_methods(["PATCH"])
def edit_card(request: WSGIRequest, card_id):
    if not Card.objects.filter(id=card_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a kártya nem létezik"
        }, status=404)

    card_obj = Card.objects.get(id=card_id)
    if card_obj.world.owner != request.user:
        return JsonResponse({
            "status": "Error",
            "error": "Ezt a kártyát nem szerkesztheted"
        }, status=403)
    if card_obj.world.is_public:
        return JsonResponse({
            "status": "Error",
            "error": "Ezt a kártyát nem törölheted, mert a hozzá tartozó világ már publikus"
        }, status=403)

    try:
        body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse({"error": "Bad request"}, status=400)

    body.pop("world", None)
    body.pop("owner", None)
    body.pop("id", None)

    Card.objects.filter(id=card_id).update(**body)

    return JsonResponse({
        "status": "Ok"
    }, status=200)


@wrappers.login_required()
@require_http_methods(["DELETE"])
def delete_card(request: WSGIRequest, card_id):
    if not Card.objects.filter(id=card_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a kártya nem létezik"
        }, status=404)
    card_obj = Card.objects.get(id=card_id)
    if card_obj.world.owner != request.user:
        return JsonResponse({
            "status": "Error",
            "error": "Ezt a kártyát nem törölheted"
        }, status=403)
    if card_obj.world.is_public:
        return JsonResponse({
            "status": "Error",
            "error": "Ezt a kártyát nem törölheted, mert a hozzá tartozó világ már publikus"
        }, status=403)
    card_obj.delete()

    return JsonResponse({
        "status": "Ok"
    }, status=200)


@wrappers.login_required()
@require_http_methods(["GET"])
def get_card_by_id(request: WSGIRequest, card_id):
    if not Card.objects.filter(id=card_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a kártya nem létezik"
        }, status=404)
    card = Card.objects.get(id=card_id)
    return JsonResponse({
        "status": "Ok",
        "card": {
            "id": card.id,
            "name": card.name,
            "hp": card.hp,
            "attack": card.attack,
            "type": card.type,
        }
    })
