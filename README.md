# 1Fi Marketplace

Full-stack **1Fi Marketplace** feature — a "shop now, pay later with mutual funds"
experience built inside the 1Fi app's Shop tab.

| Part | Stack | Folder |
|---|---|---|
| Mobile / web app | Expo · React Native · TypeScript · expo-router · TanStack Query · Zustand | [`frontend/`](frontend/) |
| API | Django · Django REST Framework · SQLite | [`backend/`](backend/) |

## Quick start

**Backend**
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver        # http://localhost:8000
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env               # points the app at the local Django API
npx expo start -c                  # press w / i / a
```

The app ships with an in-memory mock API too — set `EXPO_PUBLIC_USE_MOCK=true`
(or delete `.env`) to run the frontend with zero backend setup.

See [`frontend/README.md`](frontend/README.md) and [`backend/README.md`](backend/README.md)
for architecture and endpoint details.
