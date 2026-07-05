"""Room generation + Blender auto-launch endpoint."""
import os
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

from ai.room_generator import generate_room_layout
from blender.script_generator import generate_blender_script
from blender.launcher import launch_blender

router = APIRouter()


class RoomRequest(BaseModel):
    description: str


@router.post("/generate-room")
async def generate_room(req: RoomRequest):
    # 1. Generate room layout JSON via LLaMA
    layout = generate_room_layout(req.description)

    # 2. Convert to Blender Python script
    script = generate_blender_script(layout)

    # 3. Save script to designs directory
    designs_dir = Path(os.getenv("DESIGNS_DIR", "./saved_designs"))
    designs_dir.mkdir(parents=True, exist_ok=True)
    safe_name = req.description[:30].replace(" ", "_").replace("/", "_")
    script_path = str(designs_dir / f"room_{safe_name}.py")

    # 4. Auto-launch Blender GUI with the script
    launch_result = launch_blender(script, script_path=script_path)

    return {
        "layout": layout,
        "script": script,
        "blender": launch_result,
    }
