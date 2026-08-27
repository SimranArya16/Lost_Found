from django.contrib import admin
from .models import Item


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'item_type', 'category', 'status', 'is_verified',
                     'reported_by', 'date_occurred', 'created_at']
    list_filter = ['item_type', 'category', 'status', 'is_verified']
    search_fields = ['title', 'description', 'location']
    list_editable = ['status', 'is_verified']