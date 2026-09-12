from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_username', 'body', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    item_title = serializers.ReadOnlyField(source='item.title')
    initiator_username = serializers.ReadOnlyField(source='initiator.username')
    item_owner_username = serializers.ReadOnlyField(source='item_owner.username')
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'item', 'item_title', 'initiator', 'initiator_username',
            'item_owner', 'item_owner_username', 'created_at',
            'last_message', 'unread_count',
        ]
        read_only_fields = ['id', 'initiator', 'item_owner', 'created_at']

    def get_last_message(self, obj):
        last = obj.messages.last()
        return MessageSerializer(last).data if last else None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request:
            return 0
        return obj.messages.filter(is_read=False).exclude(sender=request.user).count()