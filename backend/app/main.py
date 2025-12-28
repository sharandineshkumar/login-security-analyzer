"""
Login Security Analyzer - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

from .services.password_analyzer import PasswordAnalyzer
from .services.breach_checker import BreachChecker
from .services.password_generator import PasswordGenerator

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="🔐 Login Security Analyzer API",
    description="Analyze password strength and check for security breaches",
    version="1.0.0"
)

# Configure CORS - Allow all origins in production for flexibility
frontend_url = os.getenv("FRONTEND_URL", "")
origins = [
    "http://localhost:5173",      # Vite dev server
    "http://localhost:3000",      # Alternative dev server
    "http://127.0.0.1:5173",
    frontend_url,
]

# In production, allow all origins if FRONTEND_URL contains wildcards or for flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production
    allow_credentials=False,  # Must be False when using wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
password_analyzer = PasswordAnalyzer()
breach_checker = BreachChecker()
password_generator = PasswordGenerator()


# ==================== Request/Response Models ====================

class PasswordRequest(BaseModel):
    password: str


class AnalysisResponse(BaseModel):
    score: int
    strength: str
    strength_color: str
    feedback: List[str]
    suggestions: List[str]
    details: dict


class BreachCheckResponse(BaseModel):
    breached: bool
    breach_count: int
    message: str


class FullAnalysisResponse(BaseModel):
    score: int
    strength: str
    strength_color: str
    feedback: List[str]
    suggestions: List[str]
    details: dict
    breached: bool
    breach_count: int
    breach_message: str


class GenerateRequest(BaseModel):
    length: int = 16
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_numbers: bool = True
    include_symbols: bool = True
    exclude_ambiguous: bool = True


class GenerateResponse(BaseModel):
    password: str
    score: int
    strength: str


# ==================== API Endpoints ====================

@app.get("/")
async def root():
    """Health check and API info"""
    return {
        "status": "healthy",
        "message": "🔐 Login Security Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "analyze": "/api/analyze",
            "breach": "/api/breach-check",
            "full": "/api/full-analysis",
            "generate": "/api/generate",
            "docs": "/docs"
        }
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "login-security-analyzer"}


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_password(request: PasswordRequest):
    """
    Analyze password strength without breach checking.
    Fast and doesn't require external API calls.
    """
    result = password_analyzer.analyze(request.password)
    return result


@app.post("/api/breach-check", response_model=BreachCheckResponse)
async def check_breach(request: PasswordRequest):
    """
    Check if password appears in known data breaches.
    Uses Have I Been Pwned API with k-anonymity.
    """
    result = await breach_checker.check(request.password)
    return result


@app.post("/api/full-analysis", response_model=FullAnalysisResponse)
async def full_analysis(request: PasswordRequest):
    """
    Complete analysis: strength check + breach detection.
    This is the recommended endpoint for comprehensive analysis.
    """
    # Get strength analysis
    strength_result = password_analyzer.analyze(request.password)
    
    # Check for breaches
    breach_result = await breach_checker.check(request.password)
    
    # Combine results
    return {
        **strength_result,
        "breached": breach_result["breached"],
        "breach_count": breach_result["breach_count"],
        "breach_message": breach_result["message"]
    }


@app.post("/api/generate", response_model=GenerateResponse)
async def generate_password(request: GenerateRequest):
    """
    Generate a secure random password with specified criteria.
    """
    password = password_generator.generate(
        length=request.length,
        uppercase=request.include_uppercase,
        lowercase=request.include_lowercase,
        numbers=request.include_numbers,
        symbols=request.include_symbols,
        exclude_ambiguous=request.exclude_ambiguous
    )
    
    # Analyze the generated password
    analysis = password_analyzer.analyze(password)
    
    return {
        "password": password,
        "score": analysis["score"],
        "strength": analysis["strength"]
    }


# ==================== Run Server ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
