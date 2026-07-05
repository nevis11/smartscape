"""RAG pipeline: FAISS vector store + Ollama embeddings."""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

_vector_store = None


def _load_knowledge() -> list[str]:
    kb_path = Path(__file__).parent.parent / "knowledge" / "interior_design.txt"
    text = kb_path.read_text(encoding="utf-8")
    # Split on double newlines into chunks
    chunks = [c.strip() for c in text.split("\n\n") if c.strip()]
    return chunks


def build_vector_store():
    global _vector_store
    chunks = _load_knowledge()
    try:
        from langchain_ollama import OllamaEmbeddings
        from langchain_community.vectorstores import FAISS

        embeddings = OllamaEmbeddings(
            model=os.getenv("OLLAMA_MODEL", "llama3.2"),
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        )
        _vector_store = FAISS.from_texts(chunks, embeddings)
        print("[RAG] FAISS index built with Ollama embeddings.")
    except Exception as e:
        print(f"[RAG] Ollama embeddings unavailable ({e}), using FakeEmbeddings.")
        from langchain_community.embeddings.fake import FakeEmbeddings
        from langchain_community.vectorstores import FAISS

        embeddings = FakeEmbeddings(size=384)
        _vector_store = FAISS.from_texts(chunks, embeddings)


def retrieve(query: str, k: int = 4) -> list[str]:
    if _vector_store is None:
        return []
    docs = _vector_store.similarity_search(query, k=k)
    return [d.page_content for d in docs]
