# backend/api/serializers.py

from rest_framework import serializers
from .models import User, Project, Task
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # Import this

# --- ADD THIS NEW CLASS ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['role'] = user.role
        # ...

        return token

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model, handles user registration and password hashing.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Hashes the password when creating a new user via the API.
        user = User.objects.create_user(**validated_data)
        return user

class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for the Task model.
    """
    class Meta:
        model = Task
        fields = '__all__'

class ProjectMemberSerializer(serializers.ModelSerializer):
    """
    A simplified serializer to display basic user information for project members.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for the Project model, with nested serializers for members and tasks.
    """
    # Use nested serializers for displaying related data when reading.
    members = ProjectMemberSerializer(many=True, read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
        # Mark 'owner' as read-only. The backend sets this field automatically in the view,
        # so we don't expect it in the user's input.
        read_only_fields = ['owner']