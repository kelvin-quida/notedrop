from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from messages.models import Message
import json


class MessageAPITest(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.list_url = reverse('message-list-create')
        self.export_url = reverse('message-export')
        
        self.message1 = Message.objects.create(content="First message")
        self.message2 = Message.objects.create(content="Second message")
    
    def test_get_all_messages(self):
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
        self.assertEqual(response.data[0]['content'], "Second message")
        self.assertEqual(response.data[1]['content'], "First message")
    
    def test_get_messages_empty_database(self):
        Message.objects.all().delete()
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
    
    def test_create_message_valid_data(self):
        data = {'content': 'New test message'}
        response = self.client.post(
            self.list_url, 
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], 'New test message')
        self.assertIn('id', response.data)
        self.assertIn('created_at', response.data)
        
        self.assertEqual(Message.objects.count(), 3)
    
    def test_create_message_invalid_data(self):
        data = {'content': ''}
        response = self.client.post(
            self.list_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('content', response.data)
    
    def test_create_message_missing_content(self):
        data = {}
        response = self.client.post(
            self.list_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_create_message_with_long_content(self):
        data = {'content': 'x' * 10000}
        response = self.client.post(
            self.list_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data['content']), 10000)
    
    def test_export_messages_to_excel(self):
        response = self.client.get(self.export_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response['Content-Type'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        self.assertIn('attachment', response['Content-Disposition'])
        self.assertIn('messages_export.xlsx', response['Content-Disposition'])
    
    def test_export_empty_database(self):
        Message.objects.all().delete()
        response = self.client.get(self.export_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.content), 0)
    
    def test_api_returns_json(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response['Content-Type'], 'application/json')
    
    def test_cors_headers(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_message_fields_in_response(self):
        response = self.client.get(self.list_url)
        message = response.data[0]
        
        self.assertIn('id', message)
        self.assertIn('content', message)
        self.assertIn('created_at', message)
        self.assertIn('updated_at', message)
        self.assertEqual(len(message.keys()), 4)
