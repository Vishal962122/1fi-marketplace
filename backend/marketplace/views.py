from django.db.models import Q
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .emi import build_emi_quote
from .models import EmiPlan, Product
from .serializers import (
    CreateOrderSerializer,
    EmiPlanSerializer,
    ProductDetailSerializer,
    ProductSummarySerializer,
)

def products_with_variants():
    return Product.objects.prefetch_related("variants")


class ProductListView(generics.ListAPIView):
    """GET /api/products?search=&category="""

    serializer_class = ProductSummarySerializer

    def get_queryset(self):
        qs = products_with_variants()
        search = self.request.query_params.get("search", "").strip()
        category = self.request.query_params.get("category", "").strip()

        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(brand__icontains=search))
        if category and category.lower() != "all":
            qs = qs.filter(category__iexact=category)
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<id>"""

    serializer_class = ProductDetailSerializer

    def get_queryset(self):
        return products_with_variants()


class EmiPlanListView(generics.ListAPIView):
    """GET /api/emi-plans"""

    serializer_class = EmiPlanSerializer
    queryset = EmiPlan.objects.filter(is_active=True)


class OrderCreateView(generics.CreateAPIView):
    """POST /api/orders  { productId, variantId, planId }"""

    serializer_class = CreateOrderSerializer


class EmiQuoteView(APIView):
    """GET /api/emi/quote?principal=72999&planId=plan-6m — full amortisation."""

    def get(self, request):
        principal_raw = request.query_params.get("principal")
        plan_id = request.query_params.get("planId")
        if not principal_raw or not plan_id:
            raise ValidationError("principal and planId are required.")
        try:
            principal = float(principal_raw)
        except ValueError:
            raise ValidationError("principal must be a number.")
        if principal <= 0:
            raise ValidationError("principal must be positive.")

        try:
            plan = EmiPlan.objects.get(pk=plan_id, is_active=True)
        except EmiPlan.DoesNotExist:
            return Response({"detail": "Plan not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(build_emi_quote(principal, plan))
