from django.urls import path

from . import views

urlpatterns = [
    path("products", views.ProductListView.as_view(), name="product-list"),
    path("products/<slug:pk>", views.ProductDetailView.as_view(), name="product-detail"),
    path("emi-plans", views.EmiPlanListView.as_view(), name="emi-plan-list"),
    path("emi/quote", views.EmiQuoteView.as_view(), name="emi-quote"),
    path("orders", views.OrderCreateView.as_view(), name="order-create"),
]
