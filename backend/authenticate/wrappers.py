from functools import wraps

from django.http import JsonResponse


def login_required():
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            logged_in = request.user.is_authenticated
            if not logged_in:
                return JsonResponse({
                    "status": "Error",
                    "error": "Nem vagy bejelentkezve",
                }, status=401)
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator
