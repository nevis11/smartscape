"""FastAPI application entry point."""
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from routers import room, chat, rag, design

app = FastAPI(
    title="AI SmartScape API",
    description="AI-driven 3D interior design backend with LLaMA + FAISS RAG + Blender auto-launch",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(room.router,   prefix="/api", tags=["Room"])
app.include_router(chat.router,   prefix="/api", tags=["Chat"])
app.include_router(rag.router,    prefix="/api", tags=["RAG"])
app.include_router(design.router, prefix="/api", tags=["Design"])


@app.on_event("startup")
async def startup_event():
    print("Building FAISS vector index...")
    from ai.rag_pipeline import build_vector_store
    build_vector_store()
    print("AI SmartScape backend ready!")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "AI SmartScape"}
