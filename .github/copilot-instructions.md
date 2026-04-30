# Copilot Instructions for MoodMart Platform Website Design

## Project Overview
- **Architecture:**
  - Full-stack MERN (MongoDB, Express, React, Node.js) monorepo with `client/` (React + Vite) and `backend/` (Node.js/Express) apps.
  - Shared root for documentation, scripts, and configuration.
  - Figma design reference: see [README.md](../README.md) for the original design link.

## Key Workflows
- **Install dependencies:**
  - `npm install` in both `client/` and `backend/`.
- **Development servers:**
  - `npm run dev` in `client/` for React app (Vite, port 5173 by default).
  - `npm run dev` in `backend/` for API server.
- **Docker:**
  - Build client: `docker build -t mern-client ./client`
  - Run client: `docker run -p 5173:5173 mern-client`
- **Environment:**
  - Copy `.env.example` to `.env` in `backend/` and set values.
  - Set `VITE_API_URL` in client environment if backend is remote.

## Patterns & Conventions
- **Backend:**
  - API routes in `backend/routes/`, models in `backend/models/`, config in `backend/config/`.
  - Use `seed.js` for initial data population.
- **Frontend:**
  - Main entry: `client/src/main.jsx`.
  - Routing in `client/src/router.jsx`.
  - Auth pages in `client/src/auth/`, main pages in `client/src/pages/`.
  - UI components in `src/app/components/` and `src/app/components/ui/`.
  - Styles in `src/assets/styles/`.
- **Shared:**
  - Scripts in `scripts/` (e.g., `backup-mongo.ps1`, `download-faceapi-models.bat`).
  - Models for face detection in `public/models/`.

## Integration & Communication
- **API:**
  - Frontend communicates with backend via REST API (see `client/src/api.js`).
- **External:**
  - Uses face-api.js models (see `public/models/`).
  - Figma assets/types in `figma-assets.d.ts` and `images.d.ts`.

## Examples
- To add a new API route: create a file in `backend/routes/` and register it in `server.js`.
- To add a new page: create a component in `client/src/pages/` and add a route in `client/src/router.jsx`.

## Tips
- Check both `client/README.md` and `backend/README.md` for up-to-date workflow details.
- Use Docker for consistent builds if local setup fails.
- Reference Figma for UI/UX consistency.
