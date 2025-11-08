from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
import traceback


class CustomExceptionHandlerMiddleware(MiddlewareMixin):
    def process_exception(self, request: WSGIRequest, exception):
        # Classify error severity
        error_type = type(exception).__name__

        # Log the error
        print(f"Error Type: {error_type}")
        print("Error Message:", exception)
        print(traceback.format_exc())

        return JsonResponse({
            "status": "Error",
            "error": "Szerver oldali hiba történt"
        }, status=500)
