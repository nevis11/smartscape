"""Room layout generator: NL text → structured JSON via LLaMA."""
import json
import re

from ai.llm import get_llm

SYSTEM_PROMPT = """You are an expert interior designer AI. Given a room description, output ONLY valid JSON (no markdown, no explanation).

The JSON must follow this schema exactly:
{
  "room": {
    "width": <number in meters>,
    "depth": <number in meters>,
    "height": <number in meters>,
    "style": "<style string>",
    "wall_color": "<hex color>",
    "floor_color": "<hex color>"
  },
  "furniture": [
    {
      "type": "<bed|sofa|desk|chair|wardrobe|table|lamp|bookshelf|tv_unit|plant>",
      "label": "<human label>",
      "position": [x, y, z],
      "size": [width, depth, height],
      "color": "<hex color>",
      "rotation": <degrees around Z axis>
    }
  ]
}

Positions are in metres from the room centre. Y is up. Keep furniture inside room bounds.
"""


def _fallback_layout(text: str) -> dict:
    """Return a sensible default layout when LLM is unavailable."""
    return {
        "room": {
            "width": 5,
            "depth": 4,
            "height": 3,
            "style": "modern",
            "wall_color": "#F5F5F0",
            "floor_color": "#8B6F47",
        },
        "furniture": [
            {"type": "bed", "label": "Queen Bed", "position": [0, 0, -1],
             "size": [1.6, 2.0, 0.6], "color": "#D4A96A", "rotation": 0},
            {"type": "desk", "label": "Study Table", "position": [1.5, 0, 0.5],
             "size": [1.2, 0.6, 0.75], "color": "#8B6F47", "rotation": 90},
            {"type": "chair", "label": "Desk Chair", "position": [1.5, 0, 1.3],
             "size": [0.5, 0.5, 0.9], "color": "#444444", "rotation": 270},
            {"type": "lamp", "label": "Floor Lamp", "position": [-1.5, 0, -1.5],
             "size": [0.2, 0.2, 1.6], "color": "#FFD700", "rotation": 0},
        ],
    }


def generate_room_layout(description: str) -> dict:
    llm = get_llm()
    prompt = f"{SYSTEM_PROMPT}\n\nRoom description: {description}"
    try:
        from langchain_core.messages import HumanMessage, SystemMessage
        result = llm.invoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=f"Room description: {description}"),
        ])
        raw = result.content if hasattr(result, "content") else str(result)
        # Extract JSON from possible markdown fences
        json_match = re.search(r"\{.*\}", raw, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return _fallback_layout(description)
    except Exception as e:
        print(f"[RoomGenerator] LLM error: {e}, using fallback layout.")
        return _fallback_layout(description)
