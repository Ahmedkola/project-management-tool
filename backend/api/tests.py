# backend/api/tests.py

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class UserRegistrationTest(TestCase):
    def setUp(self):
        """Set up the test client."""
        self.client = APIClient()

    def test_register_user(self):
        """
        Test that a new user can be successfully registered.
        """
        # Define the data for the new user
        user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'test@example.com',
            'role': 'DEVELOPER'
        }
        
        # Make a POST request to the registration endpoint
        response = self.client.post('/api/register/', user_data, format='json')
        
        # Check that the response status code is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check that the user was actually created in the database
        self.assertTrue(User.objects.filter(username='testuser').exists())