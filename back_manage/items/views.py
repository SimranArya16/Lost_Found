from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Item
from .serializers import ItemSerializer, ItemStatusUpdateSerializer
from .permissions import IsOwnerOrReadOnly


class ItemViewSet(viewsets.ModelViewSet):
    """
    Full CRUD + search/filter for lost & found items.

    GET  /api/items/                -> list (supports ?search=&category=&item_type=&status=)
    POST /api/items/                -> create (auth required)
    GET  /api/items/{id}/           -> retrieve
    PUT/PATCH /api/items/{id}/      -> update (owner or admin)
    DELETE /api/items/{id}/         -> delete (owner or admin)
    POST /api/items/{id}/verify/    -> admin verifies + sets status
    GET  /api/items/my_reports/     -> items reported by current user
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'item_type', 'status', 'is_verified']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'date_occurred']

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_reports(self, request):
        items = Item.objects.filter(reported_by=request.user)
        page = self.paginate_queryset(items)
        serializer = self.get_serializer(page or items, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def verify(self, request, pk=None):
        item = self.get_object()
        serializer = ItemStatusUpdateSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)