from rest_framework import serializers
from .models import Item


class ItemSerializer(serializers.ModelSerializer):
    reported_by_username = serializers.ReadOnlyField(source='reported_by.username')

    class Meta:
        model = Item
        fields = [
            'id', 'title', 'description', 'category', 'item_type', 'status',
            'location', 'date_occurred', 'image', 'reported_by',
            'reported_by_username', 'is_verified', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'reported_by', 'is_verified', 'created_at', 'updated_at']


class ItemStatusUpdateSerializer(serializers.ModelSerializer):
    """Used by admins/staff to verify items or change status."""
    class Meta:
        model = Item
        fields = ['status', 'is_verified']