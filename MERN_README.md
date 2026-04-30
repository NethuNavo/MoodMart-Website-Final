# Minimal MERN Scaffold

Structure:
- `backend/` — Express + Mongoose API
- `client/` — Vite + React frontend

Quick start:

```bash
# backend
cd backend
npm install
cp .env.example .env
# edit .env to set MONGO_URI and JWT_SECRET
npm run dev

# in a separate terminal: client
cd client
npm install
npm run dev
```

The client expects the API at `http://localhost:5000` by default. Set `VITE_API_URL` to change it.
