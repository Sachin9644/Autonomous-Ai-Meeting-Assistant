import os
from dotenv import load_dotenv

# Crucial: Load .env into os.environ so external libraries like HuggingFace Hub can see them
load_dotenv()

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Keys
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    HF_ENDPOINT: str = ""
    HF_HUB_OFFLINE: str = ""
    
    # Models
    WHISPER_MODEL: str = "whisper-large-v3"
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
    CHAT_MODEL: str = "openai/gpt-oss-120b"
    
    # Directory paths relative to the project root (Agentic)
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    RECORDINGS_DIR: str = os.path.join(DATA_DIR, "recordings")
    TRANSCRIPTS_DIR: str = os.path.join(DATA_DIR, "transcripts")
    CHROMADB_DIR: str = os.path.join(DATA_DIR, "chroma_db")
    GOOGLE_PROFILE_DIR: str = os.path.join(BASE_DIR, "ai-service", "google_profile")
    MODELS_DIR: str = os.path.join(BASE_DIR, "ai-service", "models")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Instantiate global settings
settings = Settings()

# Ensure data directories exist
os.makedirs(settings.RECORDINGS_DIR, exist_ok=True)
os.makedirs(settings.TRANSCRIPTS_DIR, exist_ok=True)
os.makedirs(settings.CHROMADB_DIR, exist_ok=True)
os.makedirs(settings.GOOGLE_PROFILE_DIR, exist_ok=True)
os.makedirs(settings.MODELS_DIR, exist_ok=True)
