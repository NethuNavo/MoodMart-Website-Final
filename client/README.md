# MERN Client

1. Install dependencies:

```bash
cd client
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build and serve with Docker:

```bash
docker build -t mern-client ./client
docker run -p 5173:5173 mern-client
```

Set `VITE_API_URL` in environment if backend is running elsewhere.
