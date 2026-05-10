from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import os

app = FastAPI(title="AetherForge API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommissionRequest(BaseModel):
    name: str
    email: EmailStr
    brief: str
    budget_range: str | None = None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/commissions")
def create_commission(request: CommissionRequest) -> dict[str, str]:
    return {
        "status": "received",
        "name": request.name,
    }
