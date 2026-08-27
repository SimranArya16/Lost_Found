from django.conf import settings
from django.db import models


class Item(models.Model):
    ITEM_TYPE_CHOICES = (
        ('lost', 'Lost'),
        ('found', 'Found'),
    )
    CATEGORY_CHOICES = (
        ('id_card', 'ID Card'),
        ('wallet', 'Wallet'),
        ('electronics', 'Electronics'),
        ('books', 'Books'),
        ('keys', 'Keys'),
        ('bag', 'Bag'),
        ('other', 'Other'),
    )
    STATUS_CHOICES = (
        ('active', 'active'),           # still lost / still unclaimed
        ('returned', 'returned'),     # matched and returned to owner
        ('archived', 'archived'),       # closed by admin without a match
    )

    title = models.CharField(max_length=150)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    item_type = models.CharField(max_length=5, choices=ITEM_TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')

    location = models.CharField(max_length=150, help_text="Where it was lost/found")
    date_occurred = models.DateField(help_text="Date the item was lost/found")

    image = models.ImageField(upload_to='items/%Y/%m/', blank=True, null=True)

    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items'
    )
    is_verified = models.BooleanField(default=False, help_text="Verified by admin/staff")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.item_type}] {self.title} ({self.status})"