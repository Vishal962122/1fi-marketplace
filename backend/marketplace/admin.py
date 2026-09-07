from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import EmiPlan, Order, Product, ProductVariant, Team, UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False


class UserAdmin(BaseUserAdmin):
    inlines = [UserProfileInline]
    list_display = BaseUserAdmin.list_display + ("status",)
    list_select_related = ("profile",)

    @admin.display(description="Status", ordering="profile__status")
    def status(self, obj):
        return obj.profile.get_status_display() if hasattr(obj, "profile") else "—"


admin.site.unregister(User)
admin.site.register(User, UserAdmin)





# --- Show "Teams" under the AUTHENTICATION AND AUTHORIZATION section ----------
_get_app_list = admin.AdminSite.get_app_list


def get_app_list(self, request, app_label=None):
    app_list = _get_app_list(self, request, app_label)
    auth_app = next((a for a in app_list if a["app_label"] == "auth"), None)

    team_model = None
    for app in app_list:
        for model in list(app["models"]):
            if model["object_name"] == "Team":
                team_model = model
                if app["app_label"] != "auth":
                    app["models"].remove(model)

    if team_model and auth_app and team_model not in auth_app["models"]:
        auth_app["models"].append(team_model)

    return [a for a in app_list if a["models"]]


admin.AdminSite.get_app_list = get_app_list
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "brand", "category", "starting_price")
    search_fields = ("name", "brand")
    list_filter = ("brand", "category")
    inlines = [ProductVariantInline]


@admin.register(EmiPlan)
class EmiPlanAdmin(admin.ModelAdmin):
    list_display = ("id", "tenure_months", "annual_interest_rate", "processing_fee_percent", "recommended", "is_active")
    list_editable = ("is_active", "recommended")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "product_name", "variant_label", "monthly_emi", "tenure_months", "status", "created_at")
    readonly_fields = [f.name for f in Order._meta.fields]

    def has_add_permission(self, request):
        return False

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("name", "member_count", "created_at")
    search_fields = ("name",)
    filter_horizontal = ("members", "groups")   # nice dual-list picker

    def member_count(self, obj):
        return obj.members.count()
    member_count.short_description = "Members"


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False


class UserAdmin(BaseUserAdmin):
    inlines = [UserProfileInline]
    list_display = BaseUserAdmin.list_display + ("status",)
    list_select_related = ("profile",)

    @admin.display(description="Status", ordering="profile__status")
    def status(self, obj):
        return obj.profile.get_status_display() if hasattr(obj, "profile") else "—"


admin.site.unregister(User)
admin.site.register(User, UserAdmin)