from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from items.models import Item
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer


class ConversationViewSet(viewsets.ModelViewSet):
    """
    GET  /api/chats/conversations/               -> list current user's conversations
    POST /api/chats/conversations/                -> start conversation: { "item": <item_id> }
    GET  /api/chats/conversations/{id}/messages/  -> list messages in a conversation
    POST /api/chats/conversations/{id}/messages/  -> send a message: { "body": "..." }
    """
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            Q(initiator=user) | Q(item_owner=user)
        ).select_related('item', 'initiator', 'item_owner')

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        item_id = request.data.get('item')
        item = Item.objects.filter(id=item_id).first()
        if not item:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        if item.reported_by == request.user:
            return Response({'detail': "You can't message yourself about your own report."},
                             status=status.HTTP_400_BAD_REQUEST)

        conversation, created = Conversation.objects.get_or_create(
            item=item, initiator=request.user,
            defaults={'item_owner': item.reported_by}
        )
        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def _get_conversation_or_403(self, request, pk):
        conversation = Conversation.objects.filter(pk=pk).first()
        if not conversation:
            return None
        if request.user not in (conversation.initiator, conversation.item_owner):
            return None
        return conversation

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        conversation = self._get_conversation_or_403(request, pk)
        if not conversation:
            return Response({'detail': 'Not found or access denied.'}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            # mark other user's messages as read
            conversation.messages.exclude(sender=request.user).update(is_read=True)
            msgs = conversation.messages.all()
            return Response(MessageSerializer(msgs, many=True).data)

        # POST -> send a message
        body = request.data.get('body', '').strip()
        if not body:
            return Response({'detail': 'Message body cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)
        message = Message.objects.create(conversation=conversation, sender=request.user, body=body)
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)