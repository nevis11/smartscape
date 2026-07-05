"""RAG query endpoint: FAISS retrieval + LLaMA."""
from fastapi import APIRouter
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, SystemMessage

from ai.llm import get_llm
from ai.rag_pipeline import retrieve

router = APIRouter()


class RAGRequest(BaseModel):
    query: str


@router.post("/rag-query")
async def rag_query(req: RAGRequest):
    # Retrieve relevant knowledge chunks
    chunks = retrieve(req.query, k=4)
    context = "\n\n".join(chunks) if chunks else "No specific knowledge found."

    system_prompt = (
        "You are AI SmartScape, an expert interior design assistant. "
        "Use the following interior design knowledge to answer the user's question. "
        "Be specific, practical, and reference the knowledge where relevant.\n\n"
        f"Knowledge context:\n{context}"
    )

    llm = get_llm()
    result = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=req.query),
    ])
    reply = result.content if hasattr(result, "content") else str(result)
    return {"reply": reply, "sources": chunks}
