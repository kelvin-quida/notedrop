from django.test import TestCase
from django.utils import timezone
from messages.models import Message


class MessageModelTest(TestCase):
    
    def setUp(self):
        self.message = Message.objects.create(
            content="Test message content"
        )
    
    def test_message_creation(self):
        self.assertIsNotNone(self.message.id)
        self.assertEqual(self.message.content, "Test message content")
        self.assertIsNotNone(self.message.created_at)
    
    def test_message_str_representation(self):
        expected = f"Message {self.message.id}: Test message content..."
        self.assertEqual(str(self.message), expected)
    
    def test_message_str_truncation(self):
        long_message = Message.objects.create(
            content="a" * 100
        )
        str_repr = str(long_message)
        self.assertTrue(str_repr.endswith("..."))
        self.assertLessEqual(len(str_repr.split(": ")[1]), 53)  # 50 chars + "..."
    
    def test_message_ordering(self):
        message1 = Message.objects.create(content="First")
        message2 = Message.objects.create(content="Second")
        message3 = Message.objects.create(content="Third")
        
        messages = Message.objects.all()
        self.assertEqual(messages[0].id, message3.id)
        self.assertEqual(messages[1].id, message2.id)
        self.assertEqual(messages[2].id, message1.id)
    
    def test_created_at_auto_now_add(self):
        message = Message.objects.create(content="Auto timestamp test")
        self.assertIsNotNone(message.created_at)
        self.assertLessEqual(
            (timezone.now() - message.created_at).total_seconds(), 
            1
        )
    
    def test_content_field_type(self):
        long_content = "x" * 10000
        message = Message.objects.create(content=long_content)
        self.assertEqual(len(message.content), 10000)
