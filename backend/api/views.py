# backend/api/views.py

from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import User, Project, Task
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer
from .permissions import IsAdminUser, IsManagerUser
from rest_framework_simplejwt.views import TokenObtainPairView # Import this
from .serializers import MyTokenObtainPairSerializer # Import our new serializer

# ... (other imports) ...

# --- ADD THIS NEW VIEW ---
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# --- User Views ---

class CreateUserView(generics.CreateAPIView):
    """
    Handles new user registration. Accessible by anyone.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# --- Project Views ---

class ProjectViewSet(viewsets.ModelViewSet):
    """
    Handles all CRUD operations for Projects, plus adding members.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        """Assigns permissions based on the requested action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'add_member']:
            # [cite_start]Only Admins or Managers can create, modify, or add members to projects[cite: 19, 20].
            self.permission_classes = [IsAdminUser | IsManagerUser]
        else: # For 'list' and 'retrieve'
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        """Filters projects to only show those the user is a member of."""
        user = self.request.user
        if user.is_authenticated:
            # Return projects where the current user is listed in the 'members' field.
            return user.projects.all()
        return Project.objects.none()

    def perform_create(self, serializer):
        """Sets the project owner to the current user and adds them as the first member."""
        instance = serializer.save(owner=self.request.user)
        instance.members.add(self.request.user)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """A custom endpoint to add a user (by ID) to a project's members."""
        project = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        project.members.add(user)
        return Response({'status': f'User {user.username} added to project {project.name}'}, status=status.HTTP_200_OK)

# --- Task Views ---

class TaskViewSet(viewsets.ModelViewSet):
    """
    Handles all CRUD operations for Tasks.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        """Assigns permissions based on the requested action."""
        if self.action in ['create', 'destroy']:
            # [cite_start]Only Admins or Managers can create or delete tasks[cite: 19, 20].
            self.permission_classes = [IsAdminUser | IsManagerUser]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        """Filters tasks to only show those in projects the user is a member of."""
        user = self.request.user
        if user.is_authenticated:
            return Task.objects.filter(project__members=user)
        return Task.objects.none()