from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

app = FastAPI(title="AetherForge API", version="0.1.0")


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
