# AetherForge

Digital studio car design - Next.js portfolio with interactive 3D showroom.

## Tech Stack

- **Framework**: Next.js 16.0.8 + React 19 + TypeScript
- **3D**: Three.js via @react-three/fiber + @react-three/drei
- **Animations**: GSAP
- **Styling**: Tailwind CSS 4
- **Backend**: FastAPI (Python 3.12)

## Project Structure

```
src/
├── app/          # Next.js app router
├── components/   # UI components + Showroom 3D
├── data/         # Project data and services
apps/
└── api/          # FastAPI backend
render.yaml       # Render deployment config
vercel.json       # Vercel deployment config
```

## Development

```bash
npm install
npm run dev      # http://127.0.0.1:3000
npm run build
npm run lint
```

## Deploy

### Frontend (Vercel)

The frontend deploys automatically from the main branch via Vercel.

**Required Environment Variables:**
- `NEXT_PUBLIC_API_URL` - URL of the Render API (default: https://aetherforge-api.onrender.com)

### Backend (Render)

The FastAPI backend deploys via Render using `render.yaml`.

**Build Command:** `pip install -r apps/api/requirements.txt`
**Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Features

- Cinematic intro animation
- Interactive 3D hypercar showroom
- Project collection showcase
- Design lab workflow
- Commission system

## License

Apache 2.0
