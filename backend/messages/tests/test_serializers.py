from django.test import TestCase
from messages.models import Message
from messages.serializers import MessageSerializer


class MessageSerializerTest(TestCase):
    
    def setUp(self):
        self.message_data = {
            'content': 'Test message content'
        }
        self.message = Message.objects.create(**self.message_data)
    
    def test_serializer_with_valid_data(self):
        serializer = MessageSerializer(data=self.message_data)
        self.assertTrue(serializer.is_valid())
    
    def test_serializer_with_empty_content(self):
        data = {'content': ''}
        serializer = MessageSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('content', serializer.errors)
    
    def test_serializer_with_missing_content(self):
        data = {}
        serializer = MessageSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('content', serializer.errors)
    
    def test_serializer_contains_expected_fields(self):
        serializer = MessageSerializer(instance=self.message)
        data = serializer.data
        
        self.assertIn('id', data)
        self.assertIn('content', data)
        self.assertIn('created_at', data)
    
    def test_serializer_read_only_fields(self):
        data = {
            'id': 999,
            'content': 'New content',
            'created_at': '2020-01-01T00:00:00Z'
        }
        serializer = MessageSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        message = serializer.save()
        self.assertNotEqual(message.id, 999)
        self.assertNotEqual(
            message.created_at.strftime('%Y-%m-%d'), 
            '2020-01-01'
        )
    
    def test_serializer_create(self):
        data = {'content': 'New message via serializer'}
        serializer = MessageSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        message = serializer.save()
        self.assertEqual(message.content, 'New message via serializer')
        self.assertIsNotNone(message.id)
    
    def test_serializer_update(self):
        new_data = {'content': 'Updated content'}
        serializer = MessageSerializer(
            instance=self.message, 
            data=new_data, 
            partial=True
        )
        self.assertTrue(serializer.is_valid())
        
        updated_message = serializer.save()
        self.assertEqual(updated_message.content, 'Updated content')
        self.assertEqual(updated_message.id, self.message.id)
