from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Literal
import httpx
import os
import json
from app.routes import engineering

app = FastAPI(title="AetherForge API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(engineering.router)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
API_KEY = GROQ_API_KEY
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


class CommissionRequest(BaseModel):
    name: str
    email: EmailStr
    brief: str
    budget_range: str | None = None


class AIRequest(BaseModel):
    prompt: str
    model: str | None = "grok"


class DesignAnalysisRequest(BaseModel):
    sketch_description: str
    dimensions: dict
    vehicle_type: str | None = None


class DesignSuggestion(BaseModel):
    issue: str
    severity: Literal["info", "warning", "critical"]
    suggestion: str
    affected_component: str


class DesignAnalysisResponse(BaseModel):
    overall_score: float
    proportions_ok: bool
    suggestions: list[DesignSuggestion]
    design_character: str
    estimated_category: str


def analyze_design_rules(data: DesignAnalysisRequest) -> DesignAnalysisResponse:
    suggestions = []
    dims = data.dimensions
    length = dims.get("length", 1.0)
    height = dims.get("height", 1.0)
    wheelbase = dims.get("wheelbase", 1.0)
    track_width = dims.get("track_width", 1.0)
    wheel_diameter = dims.get("wheel_diameter", 1.0)

    if wheel_diameter / height < 0.35:
        suggestions.append(DesignSuggestion(
            issue="wheels too small",
            severity="warning",
            suggestion="Increase wheel diameter for better visual balance",
            affected_component="wheels"
        ))
    if wheelbase / length < 0.55:
        suggestions.append(DesignSuggestion(
            issue="short wheelbase",
            severity="warning",
            suggestion="Consider extending wheelbase for better stability",
            affected_component="chassis"
        ))
    if height / length > 0.35:
        suggestions.append(DesignSuggestion(
            issue="too tall",
            severity="warning",
            suggestion="Lower roofline for sportier appearance",
            affected_component="roof"
        ))
    if track_width / length < 0.45:
        suggestions.append(DesignSuggestion(
            issue="narrow track",
            severity="warning",
            suggestion="Widen track for more aggressive stance",
            affected_component="overall"
        ))

    base_score = 70.0
    for s in suggestions:
        if s.severity == "critical":
            base_score -= 15
        elif s.severity == "warning":
            base_score -= 10
        else:
            base_score -= 5

    proportions_ok = len([s for s in suggestions if s.severity in ("warning", "critical")]) == 0
    score = max(0, min(100, base_score))

    return DesignAnalysisResponse(
        overall_score=score,
        proportions_ok=proportions_ok,
        suggestions=suggestions,
        design_character="balanced",
        estimated_category=data.vehicle_type or "custom"
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/healthz")
def healthz() -> dict[str, str]:
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


@app.post("/ai/analyze-design")
async def analyze_design(request: DesignAnalysisRequest) -> DesignAnalysisResponse:
    dims = request.dimensions
    prompt = f"""
You are an expert automotive design engineer.
Analyze these vehicle dimensions and description:
- Length: {dims.get("length", 0)}m
- Height: {dims.get("height", 0)}m  
- Wheelbase: {dims.get("wheelbase", 0)}m
- Track: {dims.get("track_width", 0)}m
- Wheels: {dims.get("wheel_diameter", 0)}m
- Description: {request.sketch_description}

Return JSON with:
- overall_score (0-100)
- proportions_ok (true/false)
- suggestions (list of {{issue, severity, suggestion, affected_component}})
- design_character (one word)
- estimated_category (one word)

Focus on: wheel_size_ratio, roof_height, track_vs_width, proportions.
"""

    if not API_KEY:
        return analyze_design_rules(request)

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            response.raise_for_status()
            data = response.json()

        text = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
        result = json.loads(text)

        return DesignAnalysisResponse(
            overall_score=float(result.get("overall_score", 50)),
            proportions_ok=result.get("proportions_ok", True),
            suggestions=[
                DesignSuggestion(
                    issue=s.get("issue", ""),
                    severity=s.get("severity", "info"),
                    suggestion=s.get("suggestion", ""),
                    affected_component=s.get("affected_component", "overall")
                )
                for s in result.get("suggestions", [])
            ],
            design_character=result.get("design_character", "balanced"),
            estimated_category=result.get("estimated_category", request.vehicle_type or "custom")
        )
    except Exception:
        return analyze_design_rules(request)
