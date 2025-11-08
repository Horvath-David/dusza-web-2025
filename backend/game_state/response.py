import json
from json import JSONDecodeError

from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from api.models import GameState
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
            world=body.get("world_id"),
            user=request.user,
            state=body.get("state")
        )
        return JsonResponse({
            "status": "Ok",
            "id": game_state.id
        }, status=200)

    game_state = GameState.objects.get(id=state_id)
    game_state.state = body.get("state")
    game_state.save()
    return JsonResponse({
        "status": "Ok"
    }, status=200)


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
        "world_id": game_state.world.id,
        "state": game_state.state,
        "created_at": game_state.created_at,
        "last_updated_at": game_state.last_updated_at,
    }, status=200)
