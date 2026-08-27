from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Only the user who reported an item can edit/delete it (admins can always)."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user and request.user.is_staff:
            return True
        return obj.reported_by == request.user