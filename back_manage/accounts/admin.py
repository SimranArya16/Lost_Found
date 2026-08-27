from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'college_id', 'is_staff', 'date_joined']
    list_filter = ['role', 'is_staff', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone_number', 'college_id')}),
    )