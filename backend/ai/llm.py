"""LLM wrapper: ChatOllama with mock fallback."""
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


def get_llm():
    """Return a ChatOllama instance, or a mock if Ollama is unreachable."""
    try:
        from langchain_ollama import ChatOllama
        llm = ChatOllama(
            model=OLLAMA_MODEL,
            base_url=OLLAMA_BASE_URL,
            temperature=0.7,
        )
        return llm
    except Exception:
        return _MockLLM()


class _MockLLM:
    """Deterministic fallback when Ollama is not running."""

    def invoke(self, messages):
        return _MockMessage(
            "I'm the AI SmartScape assistant. Ollama is not running — "
            "please start it with `ollama serve` to enable real AI responses."
        )

    async def ainvoke(self, messages):
        return self.invoke(messages)

    def __or__(self, other):
        """Support pipe operator chaining."""
        class _PipedChain:
            def __init__(self, llm, parser):
                self._llm = llm
                self._parser = parser

            def invoke(self, inp):
                result = self._llm.invoke(inp)
                try:
                    return self._parser.invoke(result)
                except Exception:
                    return result.content if hasattr(result, "content") else str(result)
        return _PipedChain(self, other)


class _MockMessage:
    def __init__(self, content: str):
        self.content = content
