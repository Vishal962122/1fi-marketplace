from rest_framework import serializers

from .emi import build_emi_quote, decimal2
from .models import EmiPlan, Order, Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "label", "attributes", "price", "mrp", "in_stock", "image"]


class ProductSummarySerializer(serializers.ModelSerializer):
    starting_price = serializers.ReadOnlyField()
    starting_mrp = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "brand",
            "category",
            "thumbnail",
            "starting_price",
            "starting_mrp",
            "rating",
            "rating_count",
        ]


class ProductDetailSerializer(ProductSummarySerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta(ProductSummarySerializer.Meta):
        fields = ProductSummarySerializer.Meta.fields + [
            "images",
            "description",
            "highlights",
            "specifications",
            "variants",
        ]


class EmiPlanSerializer(serializers.ModelSerializer):
    tag = serializers.SerializerMethodField()

    class Meta:
        model = EmiPlan
        fields = [
            "id",
            "tenure_months",
            "annual_interest_rate",
            "processing_fee_percent",
            "recommended",
            "tag",
        ]

    def get_tag(self, obj):
        return obj.tag or None


class OrderSerializer(serializers.ModelSerializer):
    """Read representation returned after an order is created."""

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "created_at",
            "product_name",
            "variant_label",
            "monthly_emi",
            "tenure_months",
            "total_payable",
        ]


class CreateOrderSerializer(serializers.Serializer):
    """Write payload — { productId, variantId, planId } (camelCase on the wire)."""

    product_id = serializers.SlugRelatedField(
        slug_field="id", queryset=Product.objects.all(), source="product"
    )
    variant_id = serializers.SlugRelatedField(
        slug_field="id", queryset=ProductVariant.objects.all(), source="variant"
    )
    plan_id = serializers.SlugRelatedField(
        slug_field="id", queryset=EmiPlan.objects.filter(is_active=True), source="plan"
    )

    def validate(self, attrs):
        variant, product, plan = attrs["variant"], attrs["product"], attrs["plan"]
        if variant.product_id != product.id:
            raise serializers.ValidationError("Variant does not belong to this product.")
        if not variant.in_stock:
            raise serializers.ValidationError("Selected variant is out of stock.")
        return attrs

    def create(self, validated_data):
        product = validated_data["product"]
        variant = validated_data["variant"]
        plan = validated_data["plan"]

        quote = build_emi_quote(variant.price, plan)

        return Order.objects.create(
            product=product,
            variant=variant,
            plan=plan,
            product_name=product.name,
            variant_label=variant.label,
            principal=variant.price,
            monthly_emi=decimal2(quote["monthly_emi"]),
            tenure_months=plan.tenure_months,
            total_payable=decimal2(quote["total_payable"]),
        )

    def to_representation(self, instance):
        return OrderSerializer(instance, context=self.context).data
