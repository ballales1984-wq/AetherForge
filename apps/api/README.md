# AetherForge API

Backend FastAPI placeholder for the professional architecture:

- PostgreSQL for users, concepts, orders, commissions, messages
- Redis for cache and queues
- Celery for AI/rendering/email jobs
- Cloudinary for media storage

Run locally later with:

```bash
uvicorn app.main:app --reload
```
