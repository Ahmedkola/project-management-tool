# backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TaskViewSet, CreateUserView, UserListView

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', CreateUserView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='user-list'),
]