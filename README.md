# 🏠 AI SmartScape

> **Design rooms with AI intelligence. Visualise in Blender — automatically.**

AI SmartScape is a full-stack AI-powered interior design application. Describe any room in plain English and the system generates a complete 3D scene, writes a Blender Python script, and launches Blender automatically — no manual steps required.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Natural Language → 3D Room** | Describe a room in plain English; LLaMA AI converts it into a structured layout |
| 🎨 **Auto-Launch Blender** | Generated scenes open in Blender automatically with furniture, lighting & camera |
| 💬 **RAG Design Assistant** | Chat with an AI trained on interior design knowledge via FAISS vector search |
| 💾 **Save & Export** | Save layouts to disk; export as Blender `.py` scripts or JSON |
| ⚡ **Offline-first** | Runs entirely locally using Ollama — no cloud API keys needed |

---

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — High-performance Python API
- **[LangChain](https://www.langchain.com/) + [Ollama](https://ollama.com/)** — Local LLaMA 3.2 inference
- **[FAISS](https://faiss.ai/)** — Vector similarity search for RAG
- **[Blender](https://www.blender.org/)** — 3D scene generation & rendering

### Frontend
- **[Next.js 16](https://nextjs.org/)** — React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe frontend
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling
- **[Lucide React](https://lucide.dev/)** — Icon library

### Infrastructure
- **[Docker Compose](https://docs.docker.com/compose/)** — One-command deployment

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Ollama](https://ollama.com/) — for local LLM inference
- [Blender](https://www.blender.org/download/) — for 3D visualisation
- [Docker & Docker Compose](https://docs.docker.com/get-docker/) *(optional)*

---

### 1. Clone the repository

```bash
git clone https://github.com/nevis11/smartscape.git
cd smartscape
```

---

### 2. Start Ollama & pull the model

```bash
# Install Ollama from https://ollama.com, then:
ollama serve

# In a new terminal, pull the LLaMA model:
ollama pull llama3.2
```

---

### 3. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp ../.env.example .env
# Edit .env if needed (defaults work out of the box)

# Start the backend
uvicorn main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**  
Interactive docs at **http://localhost:8000/docs**

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:3000**

---

### 5. Docker (Alternative — runs everything at once)

```bash
# From the project root
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

> **Note:** Ollama must still be running on the host machine. The Docker backend connects to it via `host.docker.internal:11434`.

---

## ⚙️ Configuration

Copy `.env.example` to `backend/.env` and adjust as needed:

```env
OLLAMA_BASE_URL=http://localhost:11434   # Ollama server URL
OLLAMA_MODEL=llama3.2                    # Model to use
BLENDER_PATH=blender                     # Path to Blender executable
DESIGNS_DIR=./saved_designs              # Where to save room scripts
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/generate-room` | Generate room layout + launch Blender |
| `POST` | `/api/chat` | Chat with the design assistant |
| `POST` | `/api/rag` | Query the RAG knowledge base |
| `POST` | `/api/design` | Save / manage room designs |

Full interactive docs available at **http://localhost:8000/docs**

---

## 🗂️ Project Structure

```
smartscape/
├── backend/
│   ├── ai/
│   │   ├── llm.py              # LLaMA wrapper (ChatOllama + mock fallback)
│   │   ├── rag_pipeline.py     # FAISS vector store + Ollama embeddings
│   │   └── room_generator.py   # Natural language → room layout JSON
│   ├── blender/
│   │   ├── script_generator.py # Room layout → Blender Python script
│   │   └── launcher.py         # Auto-launches Blender with the script
│   ├── routers/
│   │   ├── room.py             # POST /api/generate-room
│   │   ├── chat.py             # POST /api/chat
│   │   ├── rag.py              # POST /api/rag
│   │   └── design.py           # POST /api/design
│   ├── knowledge/
│   │   └── interior_design.txt # RAG knowledge base
│   ├── tests/
│   │   └── test_api.py         # API test suite
│   ├── main.py                 # FastAPI app entry point
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── designer/page.tsx   # Main designer interface
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ChatPanel.tsx       # AI chat interface
│   │   ├── NLInput.tsx         # Natural language input
│   │   └── ScriptPanel.tsx     # Blender script viewer
│   ├── lib/
│   │   └── api.ts              # API client
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🧪 Running Tests

```bash
cd backend

# Activate your virtual environment first
venv\Scripts\activate

# Run the test suite
pytest
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

---

<div align="center">
  <strong>AI SmartScape</strong> — Local LLaMA · FAISS RAG · Blender 3D · FastAPI · Next.js
</div>
