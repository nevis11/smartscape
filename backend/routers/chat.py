"""General chat endpoint powered by local LLaMA."""
from fastapi import APIRouter
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, SystemMessage

from ai.llm import get_llm

router = APIRouter()

SYSTEM_PROMPT = (
    "You are AI SmartScape, an expert interior design assistant. "
    "Give concise, practical, and creative advice about interior design, "
    "room layouts, color palettes, furniture, and decor. "
    "Always be helpful and encouraging."
)


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


@router.post("/chat")
async def chat(req: ChatRequest):
    llm = get_llm()

    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    for turn in req.history[-10:]:  # keep last 10 turns for context
        role = turn.get("role", "user")
        content = turn.get("content", "")
        if role == "user":
            messages.append(HumanMessage(content=content))
        else:
            from langchain_core.messages import AIMessage
            messages.append(AIMessage(content=content))
    messages.append(HumanMessage(content=req.message))

    result = llm.invoke(messages)
    reply = result.content if hasattr(result, "content") else str(result)
    return {"reply": reply}
