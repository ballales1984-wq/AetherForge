from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import httpx
import os

app = FastAPI(title="AetherForge API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
API_KEY = GROQ_API_KEY
GROQ_API_URL = "https://api.groq.com/v1/chat/completions"


class CommissionRequest(BaseModel):
    name: str
    email: EmailStr
    brief: str
    budget_range: str | None = None


class AIRequest(BaseModel):
    prompt: str
    model: str | None = "grok"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/commissions")
def create_commission(request: CommissionRequest) -> dict[str, str]:
    return {
        "status": "received",
        "name": request.name,
    }


@app.post("/ai/generate")
async def generate_ai(request: AIRequest) -> dict[str, str]:
    if not API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")

    payload = {
        "model": request.model,
        "messages": [{"role": "user", "content": request.prompt}],
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

    text = data.get("choices", [{}])[0].get("message", {}).get("content", "")

    return {
        "status": "ok",
        "model": request.model,
        "prompt": request.prompt,
        "text": text.strip(),
    }
