from django.urls import path, include
from .views import RegisterView, LoginView, UserViewSet, RoomViewSet, TeamViewSet, EventViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'events', EventViewSet)

urlpatterns = [
    path('auth/register', RegisterView.as_view()),
    path("auth/login", LoginView.as_view()),
    path("", include(router.urls))
]