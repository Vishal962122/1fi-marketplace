"""
Seed the catalogue with the same data the app's mock API ships, so the
frontend behaves identically against mock and real backends.

    python manage.py seed          # upsert
    python manage.py seed --fresh  # wipe products/variants/plans first
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from marketplace.models import EmiPlan, Product, ProductVariant


def img(seed: str) -> str:
    return f"https://picsum.photos/seed/{seed}/800/800"


PRODUCTS = [
    {
        "id": "iphone-15",
        "name": "iPhone 15",
        "brand": "Apple",
        "category": "Smartphones",
        "thumbnail": img("iphone15-black"),
        "rating": 4.7,
        "rating_count": 1240,
        "images": [img("iphone15-black"), img("iphone15-back"), img("iphone15-side")],
        "description": (
            "A 6.1-inch Super Retina XDR display, Dynamic Island, a 48MP main camera "
            "and the A16 Bionic chip. Built with aerospace-grade aluminium and "
            "colour-infused glass."
        ),
        "highlights": [
            "48MP main camera with 2x telephoto",
            "A16 Bionic chip",
            "USB-C, all-day battery life",
            "Ceramic Shield front",
        ],
        "specifications": [
            {"label": "Display", "value": '6.1" OLED, 60Hz'},
            {"label": "Chipset", "value": "Apple A16 Bionic"},
            {"label": "Rear camera", "value": "48MP + 12MP"},
            {"label": "Battery", "value": "3349 mAh"},
            {"label": "Warranty", "value": "1 year"},
        ],
        "variants": [
            {"id": "iphone-15-128-black", "label": "128 GB · Black", "attributes": {"Storage": "128 GB", "Colour": "Black"}, "price": 72999, "mrp": 79900, "in_stock": True, "image": img("iphone15-black")},
            {"id": "iphone-15-128-blue", "label": "128 GB · Blue", "attributes": {"Storage": "128 GB", "Colour": "Blue"}, "price": 72999, "mrp": 79900, "in_stock": True, "image": img("iphone15-blue")},
            {"id": "iphone-15-256-black", "label": "256 GB · Black", "attributes": {"Storage": "256 GB", "Colour": "Black"}, "price": 82999, "mrp": 89900, "in_stock": True, "image": img("iphone15-black")},
            {"id": "iphone-15-256-pink", "label": "256 GB · Pink", "attributes": {"Storage": "256 GB", "Colour": "Pink"}, "price": 82999, "mrp": 89900, "in_stock": False, "image": img("iphone15-pink")},
        ],
    },
    {
        "id": "galaxy-s24",
        "name": "Samsung Galaxy S24",
        "brand": "Samsung",
        "category": "Smartphones",
        "thumbnail": img("galaxys24"),
        "rating": 4.5,
        "rating_count": 860,
        "images": [img("galaxys24"), img("galaxys24-back")],
        "description": (
            "Galaxy AI is here. A flat 6.2-inch FHD+ Dynamic AMOLED 2X display, "
            "Snapdragon 8 Gen 3 for Galaxy, and a pro-grade triple camera."
        ),
        "highlights": ["Galaxy AI features", "Snapdragon 8 Gen 3", "50MP triple camera", "7 years of OS updates"],
        "specifications": [
            {"label": "Display", "value": '6.2" AMOLED, 120Hz'},
            {"label": "Chipset", "value": "Snapdragon 8 Gen 3"},
            {"label": "Rear camera", "value": "50MP + 12MP + 10MP"},
            {"label": "Battery", "value": "4000 mAh"},
            {"label": "Warranty", "value": "1 year"},
        ],
        "variants": [
            {"id": "galaxy-s24-128-onyx", "label": "8/128 GB · Onyx Black", "attributes": {"Storage": "128 GB", "Colour": "Onyx Black"}, "price": 67999, "mrp": 74999, "in_stock": True},
            {"id": "galaxy-s24-256-marble", "label": "8/256 GB · Marble Grey", "attributes": {"Storage": "256 GB", "Colour": "Marble Grey"}, "price": 73999, "mrp": 79999, "in_stock": True},
        ],
    },
    {
        "id": "macbook-air-m3",
        "name": 'MacBook Air 13" (M3)',
        "brand": "Apple",
        "category": "Laptops",
        "thumbnail": img("macbookair"),
        "rating": 4.8,
        "rating_count": 430,
        "images": [img("macbookair"), img("macbookair-open")],
        "description": (
            "The M3 chip makes MacBook Air even more capable. Up to 18 hours of battery "
            "life, a fanless design, and a brilliant Liquid Retina display."
        ),
        "highlights": ["Apple M3 chip", "Up to 18 hrs battery", '13.6" Liquid Retina', "1.24 kg"],
        "specifications": [
            {"label": "Display", "value": '13.6" Liquid Retina'},
            {"label": "Chip", "value": "Apple M3, 8-core CPU"},
            {"label": "Memory", "value": "8 GB / 16 GB"},
            {"label": "Battery", "value": "Up to 18 hours"},
            {"label": "Warranty", "value": "1 year"},
        ],
        "variants": [
            {"id": "mba-m3-8-256", "label": "M3 · 8 GB · 256 GB", "attributes": {"Memory": "8 GB", "Storage": "256 GB"}, "price": 104999, "mrp": 114900, "in_stock": True},
            {"id": "mba-m3-16-512", "label": "M3 · 16 GB · 512 GB", "attributes": {"Memory": "16 GB", "Storage": "512 GB"}, "price": 134999, "mrp": 144900, "in_stock": True},
        ],
    },
    {
        "id": "sony-wh1000xm5",
        "name": "Sony WH-1000XM5",
        "brand": "Sony",
        "category": "Audio",
        "thumbnail": img("sonyxm5"),
        "rating": 4.6,
        "rating_count": 2100,
        "images": [img("sonyxm5"), img("sonyxm5-case")],
        "description": (
            "Industry-leading noise cancellation with two processors controlling eight "
            "microphones. Up to 30 hours of battery with quick charging."
        ),
        "highlights": ["Best-in-class ANC", "30 hr battery", "Multipoint connection", "Speak-to-chat"],
        "specifications": [
            {"label": "Type", "value": "Over-ear, wireless"},
            {"label": "Battery", "value": "30 hours (ANC on)"},
            {"label": "Codecs", "value": "LDAC, AAC, SBC"},
            {"label": "Weight", "value": "250 g"},
            {"label": "Warranty", "value": "1 year"},
        ],
        "variants": [
            {"id": "xm5-black", "label": "Black", "attributes": {"Colour": "Black"}, "price": 26990, "mrp": 34990, "in_stock": True},
            {"id": "xm5-silver", "label": "Silver", "attributes": {"Colour": "Silver"}, "price": 26990, "mrp": 34990, "in_stock": True},
        ],
    },
]

EMI_PLANS = [
    {"id": "plan-3m", "tenure_months": 3, "annual_interest_rate": 0, "processing_fee_percent": 0, "tag": "No cost EMI", "position": 0},
    {"id": "plan-6m", "tenure_months": 6, "annual_interest_rate": 13, "processing_fee_percent": 1, "recommended": True, "position": 1},
    {"id": "plan-9m", "tenure_months": 9, "annual_interest_rate": 14, "processing_fee_percent": 1, "position": 2},
    {"id": "plan-12m", "tenure_months": 12, "annual_interest_rate": 15, "processing_fee_percent": 1.5, "position": 3},
]


class Command(BaseCommand):
    help = "Load demo products, variants and EMI plans."

    def add_arguments(self, parser):
        parser.add_argument("--fresh", action="store_true", help="Delete existing catalogue first.")

    @transaction.atomic
    def handle(self, *args, **options):
        if options["fresh"]:
            ProductVariant.objects.all().delete()
            Product.objects.all().delete()
            EmiPlan.objects.all().delete()
            self.stdout.write(self.style.WARNING("Cleared existing catalogue."))

        for plan in EMI_PLANS:
            EmiPlan.objects.update_or_create(id=plan["id"], defaults=plan)

        for product in PRODUCTS:
            variants = product.pop("variants")
            Product.objects.update_or_create(id=product["id"], defaults=product)
            for position, variant in enumerate(variants):
                ProductVariant.objects.update_or_create(
                    id=variant["id"],
                    defaults={**variant, "product_id": product["id"], "position": position},
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(PRODUCTS)} products and {len(EMI_PLANS)} EMI plans."
            )
        )
