from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from messages.models import Message


class DeleteAllMessagesTest(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('message-list-create')
        
        Message.objects.create(content="Message 1")
        Message.objects.create(content="Message 2")
        Message.objects.create(content="Message 3")
    
    def test_delete_all_messages(self):
        self.assertEqual(Message.objects.count(), 3)
        
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('3', response.data['message'])
        
        self.assertEqual(Message.objects.count(), 0)
    
    def test_delete_all_when_empty(self):
        Message.objects.all().delete()
        self.assertEqual(Message.objects.count(), 0)
        
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('0', response.data['message'])
    
    def test_delete_all_returns_count(self):
        Message.objects.create(content="Message 4")
        Message.objects.create(content="Message 5")
        
        count_before = Message.objects.count()
        
        response = self.client.delete(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(str(count_before), response.data['message'])
        self.assertEqual(Message.objects.count(), 0)
    
    def test_delete_all_resets_id_sequence(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        new_message = Message.objects.create(content="First after reset")
        
        self.assertEqual(new_message.id, 1)
