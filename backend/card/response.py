import json
from json import JSONDecodeError

from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.shortcuts import render

from api.models import Card, World


# Create your views here.


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

    for i in to_create:
        Card.objects.create(
            name=i.get("name"),
            hp=i.get("hp"),
            attack=i.get("attack"),
            type=i.get("type"),
            world=world
        )

    return JsonResponse({"status": "Ok"}, status=200)
