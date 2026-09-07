import uuid

from django.contrib.auth.models import Group, User
from django.db import models


class Product(models.Model):
    """A catalogue item. Pricing lives on its variants."""

    id = models.SlugField(primary_key=True, max_length=64)
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=120)
    category = models.CharField(max_length=80)
    thumbnail = models.URLField()
    description = models.TextField(blank=True)

    # Flexible presentation data — kept as JSON so the shape matches the client
    # 1:1 without extra join tables.
    images = models.JSONField(default=list)  # list[str]
    highlights = models.JSONField(default=list)  # list[str]
    specifications = models.JSONField(default=list)  # list[{"label", "value"}]

    rating = models.FloatField(null=True, blank=True)
    rating_count = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    # --- derived pricing --------------------------------------------------
    @property
    def _cheapest_variant(self):
        return min(
            self.variants.all(),
            key=lambda v: v.price,
            default=None,
        )

    @property
    def starting_price(self):
        v = self._cheapest_variant
        return v.price if v else 0

    @property
    def starting_mrp(self):
        v = self._cheapest_variant
        return v.mrp if v else 0


class ProductVariant(models.Model):
    id = models.SlugField(primary_key=True, max_length=80)
    product = models.ForeignKey(Product, related_name="variants", on_delete=models.CASCADE)
    label = models.CharField(max_length=160)
    attributes = models.JSONField(default=dict)  # {"Storage": "128 GB", ...}
    price = models.DecimalField(max_digits=12, decimal_places=2)
    mrp = models.DecimalField(max_digits=12, decimal_places=2)
    in_stock = models.BooleanField(default=True)
    image = models.URLField(blank=True, default="")
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "price"]

    def __str__(self) -> str:
        return f"{self.product_id} · {self.label}"


class EmiPlan(models.Model):
    id = models.SlugField(primary_key=True, max_length=32)
    tenure_months = models.PositiveIntegerField()
    annual_interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    processing_fee_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    recommended = models.BooleanField(default=False)
    tag = models.CharField(max_length=40, blank=True, default="")
    is_active = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "tenure_months"]

    def __str__(self) -> str:
        return f"{self.tenure_months} months @ {self.annual_interest_rate}%"


class Order(models.Model):
    STATUS_CONFIRMED = "CONFIRMED"

    id = models.CharField(primary_key=True, max_length=40, editable=False)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT)
    plan = models.ForeignKey(EmiPlan, on_delete=models.PROTECT)

    # Denormalised snapshot so the order still reads correctly if the
    # catalogue changes later.
    product_name = models.CharField(max_length=200)
    variant_label = models.CharField(max_length=160)
    principal = models.DecimalField(max_digits=12, decimal_places=2)
    monthly_emi = models.DecimalField(max_digits=12, decimal_places=2)
    tenure_months = models.PositiveIntegerField()
    total_payable = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(max_length=16, default=STATUS_CONFIRMED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = f"ord_{uuid.uuid4().hex[:20]}"
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.id
    
class Team(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(User, related_name="teams", blank=True)
    groups = models.ManyToManyField(Group, related_name="teams", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        PENDING = "PENDING", "Pending"
        SUSPENDED = "SUSPENDED", "Suspended"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.ACTIVE
    )

    def __str__(self):
        return f"{self.user.username} · {self.get_status_display()}"


from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=User)
def ensure_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)