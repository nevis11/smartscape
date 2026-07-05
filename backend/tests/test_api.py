"""Pytest smoke tests for AI SmartScape API (mocks LLM + Blender launch)."""
import pytest
import json
from unittest.mock import patch, MagicMock
from httpx import AsyncClient, ASGITransport

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Patch Blender launcher and LLM before importing app
with patch("blender.launcher.launch_blender", return_value={"status": "mocked"}):
    with patch("ai.rag_pipeline.build_vector_store"):
        from main import app


MOCK_LAYOUT = {
    "room": {"width": 5, "depth": 4, "height": 3, "style": "modern",
             "wall_color": "#FFFFFF", "floor_color": "#8B6F47"},
    "furniture": [
        {"type": "bed", "label": "Queen Bed", "position": [0, 0, -1],
         "size": [1.6, 2.0, 0.6], "color": "#D4A96A", "rotation": 0}
    ],
}

MOCK_REPLY = MagicMock()
MOCK_REPLY.content = "Great choice! A minimalist bedroom works wonderfully with neutral tones."


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_generate_room(client):
    with patch("ai.room_generator.generate_room_layout", return_value=MOCK_LAYOUT):
        with patch("blender.launcher.launch_blender", return_value={"status": "mocked"}):
            response = await client.post(
                "/api/generate-room",
                json={"description": "A modern bedroom with a queen bed"}
            )
    assert response.status_code == 200
    data = response.json()
    assert "layout" in data
    assert "script" in data
    assert "bpy" in data["script"]


@pytest.mark.asyncio
async def test_chat(client):
    with patch("ai.llm.get_llm") as mock_llm_fn:
        mock_llm = MagicMock()
        mock_llm.invoke.return_value = MOCK_REPLY
        mock_llm_fn.return_value = mock_llm
        response = await client.post(
            "/api/chat",
            json={"message": "What colors suit a small bedroom?"}
        )
    assert response.status_code == 200
    assert "reply" in response.json()


@pytest.mark.asyncio
async def test_rag_query(client):
    with patch("ai.rag_pipeline.retrieve", return_value=["Light colors make rooms feel larger."]):
        with patch("ai.llm.get_llm") as mock_llm_fn:
            mock_llm = MagicMock()
            mock_llm.invoke.return_value = MOCK_REPLY
            mock_llm_fn.return_value = mock_llm
            response = await client.post(
                "/api/rag-query",
                json={"query": "Suggest minimalistic living room design"}
            )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "sources" in data


@pytest.mark.asyncio
async def test_save_and_list_designs(client, tmp_path, monkeypatch):
    monkeypatch.setenv("DESIGNS_DIR", str(tmp_path))
    # Reload the design router's DESIGNS_DIR
    import routers.design as design_module
    design_module.DESIGNS_DIR = tmp_path

    response = await client.post(
        "/api/save-design",
        json={"name": "Test Room", "layout": MOCK_LAYOUT, "script": "import bpy"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "saved"

    response2 = await client.get("/api/designs")
    assert response2.status_code == 200
    assert len(response2.json()["designs"]) >= 1
