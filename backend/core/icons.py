"""Canonical icon-key registry shared by every icon-key field in the CMS.

Icon fields store a short key (e.g. "shield-check"), never an uploaded image
— the frontend maps each key to a real lucide-react vector icon component
(see frontend/src/lib/icons.tsx), so admin-picked icons stay crisp vectors
identical in kind to the ones already hardcoded in the UI.
"""

ICON_CHOICES = [
    ('award', 'Award'),
    ('map-pin', 'Map Pin'),
    ('graduation-cap', 'Graduation Cap'),
    ('users-round', 'Users'),
    ('badge-check', 'Badge Check'),
    ('shield-check', 'Shield Check'),
    ('star', 'Star'),
    ('trophy', 'Trophy'),
    ('check-circle', 'Check Circle'),
    ('sparkles', 'Sparkles'),
    ('book-open', 'Book Open'),
    ('briefcase', 'Briefcase'),
    ('wrench', 'Wrench'),
    ('target', 'Target'),
    ('rocket', 'Rocket'),
    ('heart-handshake', 'Heart Handshake'),
]

DEFAULT_ICON = 'sparkles'
