# AetherForge

Digital studio car design - Next.js portfolio with interactive 3D showroom.

## Tech Stack

- **Framework**: Next.js 16.0.8 + React 19 + TypeScript
- **3D**: Three.js via @react-three/fiber + @react-three/drei
- **Animations**: GSAP
- **Styling**: Tailwind CSS 4
- **Backend**: FastAPI (Python 3.12)

## Project Structure

```text
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

- `NEXT_PUBLIC_API_URL` - https://aetherforge-qanw.onrender.com
- `GROQ_API_KEY` - Your GROQ API key for AI features

### Backend (Render)

The FastAPI backend deploys via Render using `render.yaml`.

**URL:** https://aetherforge-qanw.onrender.com

**Endpoints:**
- `GET /health` - Health check
- `POST /commissions` - Submit commission request
- `POST /ai/generate` - AI text generation (requires OPENAI_API_KEY)

## Features

- Cinematic intro animation
- Interactive 3D hypercar showroom
- Project collection showcase
- Design lab workflow
- Commission system

## License

Apache 2.0
