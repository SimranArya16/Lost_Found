from django.conf import settings
from django.db import models
from items.models import Item


class Conversation(models.Model):
    """One conversation per (item, initiator) pair."""
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='conversations')
    initiator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='started_conversations'
    )
    item_owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_conversations'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('item', 'initiator')
        ordering = ['-created_at']

    def __str__(self):
        return f"Conversation on '{self.item.title}' between {self.initiator} and {self.item_owner}"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender}: {self.body[:30]}"