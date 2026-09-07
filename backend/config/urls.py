from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(_request):
    return JsonResponse({"status": "ok", "service": "1fi-marketplace-api"})


urlpatterns = [
    path("", health),
    path("admin/", admin.site.urls),
    path("api/", include("marketplace.urls")),
]
