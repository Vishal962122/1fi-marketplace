from django.contrib.admin import AdminSite

class MarketplaceAdminSite(AdminSite):
    def get_app_list(self, request, app_label=None):
        app_list = super().get_app_list(request, app_label)
        auth_app = next((a for a in app_list if a["app_label"] == "auth"), None)
        mk_app = next((a for a in app_list if a["app_label"] == "marketplace"), None)
        if auth_app and mk_app:
            team = next((m for m in mk_app["models"] if m["object_name"] == "Team"), None)
            if team:
                mk_app["models"].remove(team)
                auth_app["models"].append(team)
        return app_list