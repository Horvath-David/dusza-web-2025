from datetime import datetime, timezone
import json
from json import JSONDecodeError

from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from api.models import Card, Dungeon, GameState, UserData, World
from authenticate import wrappers

# Create your views here.


@wrappers.login_required()
@require_http_methods(["PUT"])
def save_game_state(request: WSGIRequest):
    try:
        body = json.loads(request.body)
    except JSONDecodeError:
        return JsonResponse({"error": "Bad request"}, status=400)

    state_id = body.get("id")
    if not state_id or not GameState.objects.filter(id=state_id).exists():
        game_state = GameState.objects.create(
            world=World.objects.get(id=body.get("world_id")),
            user=request.user,
            state=body.get("state"),
            created_at=datetime.now(tz=timezone.utc),
            last_updated_at=datetime.now(tz=timezone.utc),
        )
        return JsonResponse({
            "status": "Ok",
            "id": game_state.id,
            "world_name": game_state.world.name,
        }, status=200)

    game_state = GameState.objects.get(id=state_id)
    game_state.state = body.get("state")
    game_state.last_updated_at = datetime.now(tz=timezone.utc)
    game_state.save()
    return JsonResponse({
        "status": "Ok",
        "id": game_state.id,
        "world_name": game_state.world.name,
    }, status=200)


@wrappers.login_required()
@require_http_methods(["GET"])
def get_my_game_states(request: WSGIRequest):
    game_states = GameState.objects.filter(user=request.user)
    return JsonResponse({
        "status": "Ok",
        "game_states": [{
            "id": i.id,
            "world": {
                "id": i.world.id,
                "name": i.world.name,
                "owner": UserData.objects.get(user=i.world.owner).display_name if i.world.owner else "Törölt felhasználó",
            },
            "owner": UserData.objects.get(user=i.user).display_name if i.user else "Törölt felhasználó",
            "state": i.state,
            "created_at": i.created_at,
            "last_updated_at": i.last_updated_at,
        } for i in game_states.all().order_by("-last_updated_at")]
    })


@wrappers.login_required()
@require_http_methods(["GET"])
def get_game_state(request: WSGIRequest, state_id):
    if not GameState.objects.filter(id=state_id).exists():
        return JsonResponse({
            "status": "Error",
            "error": "Ez a játékmentés nem létezik"
        }, status=404)

    game_state = GameState.objects.get(id=state_id)
    if game_state.user != request.user:
        return JsonResponse({
            "status": "Error",
            "error": "Ez nem a te mentett játékod"
        }, status=403)

    return JsonResponse({
        "status": "Ok",
        "game_state": {
            "id": game_state.id,
            "world": {
                "id": game_state.world.id,
                "name": game_state.world.name,
                "owner": UserData.objects.get(user=game_state.world.owner).display_name if game_state.world.owner else "Törölt felhasználó",
            },
            "owner": UserData.objects.get(user=game_state.user).display_name if game_state.user else "Törölt felhasználó",
            "state": game_state.state,
            "created_at": game_state.created_at,
            "last_updated_at": game_state.last_updated_at,
        }
    }, status=200)
