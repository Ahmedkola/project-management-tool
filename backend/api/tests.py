# backend/api/tests.py

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class UserRegistrationTest(TestCase):
    def setUp(self):
       
        self.client = APIClient()

    def test_register_user(self):
      
        user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'test@example.com',
            'role': 'DEVELOPER'
        }
        
       
        response = self.client.post('/api/register/', user_data, format='json')
        
       
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
       
        self.assertTrue(User.objects.filter(username='testuser').exists())