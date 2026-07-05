"""Design save/load endpoints."""
import json
import os
from pathlib import Path
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

router = APIRouter()

DESIGNS_DIR = Path(os.getenv("DESIGNS_DIR", "./saved_designs"))


class SaveRequest(BaseModel):
    name: str
    layout: dict
    script: str = ""


@router.post("/save-design")
async def save_design(req: SaveRequest):
    DESIGNS_DIR.mkdir(parents=True, exist_ok=True)
    safe_name = req.name.replace(" ", "_").replace("/", "_")[:40]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = DESIGNS_DIR / f"{safe_name}_{timestamp}.json"
    data = {
        "name": req.name,
        "saved_at": timestamp,
        "layout": req.layout,
        "script": req.script,
    }
    file_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return {"status": "saved", "file": str(file_path)}


@router.get("/designs")
async def list_designs():
    DESIGNS_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(DESIGNS_DIR.glob("*.json"), key=lambda f: f.stat().st_mtime, reverse=True)
    designs = []
    for f in files[:20]:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            designs.append({
                "name": data.get("name", f.stem),
                "saved_at": data.get("saved_at", ""),
                "file": f.name,
            })
        except Exception:
            pass
    return {"designs": designs}


@router.get("/designs/{filename}")
async def get_design(filename: str):
    path = DESIGNS_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="Design not found")
    data = json.loads(path.read_text(encoding="utf-8"))
    return data


@router.get("/export-blender/{filename}")
async def export_blender_script(filename: str):
    """Download the Blender .py script for a saved design."""
    json_path = DESIGNS_DIR / filename
    if not json_path.exists():
        raise HTTPException(status_code=404, detail="Design not found")
    data = json.loads(json_path.read_text(encoding="utf-8"))
    script = data.get("script", "")
    py_path = json_path.with_suffix(".py")
    py_path.write_text(script, encoding="utf-8")
    return FileResponse(str(py_path), media_type="text/x-python", filename=py_path.name)
