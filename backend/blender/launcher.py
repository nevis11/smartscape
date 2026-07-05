"""
Auto-launches Blender with a generated room script.
Blender opens as a GUI with the script already executed so the 3D room is visible.
"""
import os
import subprocess
import sys
import tempfile
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BLENDER_PATH = os.getenv("BLENDER_PATH", "blender")


def launch_blender(script_content: str, script_path: str | None = None) -> dict:
    """
    Write script to disk and open Blender GUI with the script pre-executed.
    Returns a dict with status and the path to the saved script.
    """
    # Save the script to the designs dir or a temp file
    if script_path:
        Path(script_path).parent.mkdir(parents=True, exist_ok=True)
        path = Path(script_path)
    else:
        tmp = tempfile.NamedTemporaryFile(
            suffix=".py", prefix="smartscape_room_", delete=False
        )
        path = Path(tmp.name)
        tmp.close()

    path.write_text(script_content, encoding="utf-8")

    # Blender command:
    #   blender --python <script>
    # This opens Blender GUI and immediately runs the script.
    cmd = [BLENDER_PATH, "--python", str(path)]

    try:
        # Popen (non-blocking) so the backend doesn't wait for Blender to close
        subprocess.Popen(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            close_fds=(sys.platform != "win32"),
        )
        return {"status": "launched", "script_path": str(path)}
    except FileNotFoundError:
        # Blender not on PATH — return the path so the user can open it manually
        return {
            "status": "blender_not_found",
            "script_path": str(path),
            "message": (
                "Blender was not found on PATH. "
                f"Set BLENDER_PATH in .env to the full path of your blender executable, "
                f"or open '{path}' manually in Blender's Scripting tab.\n"
                "Common Windows path: C:\\Program Files\\Blender Foundation\\Blender 4.x\\blender.exe"
            ),
        }
    except Exception as e:
        return {"status": "error", "script_path": str(path), "message": str(e)}
