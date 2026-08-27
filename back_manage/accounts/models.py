from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model — students, staff and admins."""

    ROLE_CHOICES = (
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    phone_number = models.CharField(max_length=15, blank=True)
    college_id = models.CharField(max_length=30, blank=True, help_text="College/roll number")

    def __str__(self):
        return f"{self.username} ({self.role})"