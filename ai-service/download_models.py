import os
from huggingface_hub import hf_hub_download
from app.config import settings

def download_local_models():
    print(f"==================================================")
    print(f"Downloading Llama 3.2 (3B) for local offline usage")
    print(f"==================================================")
    
    # We use Bartowski's quantized Llama 3.2 which fits perfectly in 3GB of RAM
    repo_id = "bartowski/Llama-3.2-3B-Instruct-GGUF"
    filename = "Llama-3.2-3B-Instruct-Q4_K_M.gguf"
    
    print(f"Downloading {filename} (approx 2.0 GB)...")
    print("This might take a few minutes depending on your internet speed.")
    
    model_path = hf_hub_download(
        repo_id=repo_id,
        filename=filename,
        local_dir=settings.MODELS_DIR,
        local_dir_use_symlinks=False
    )
    
    print(f"\n✅ Model successfully downloaded to: {model_path}")
    print(f"Your AI service is now fully offline and self-contained!")

if __name__ == "__main__":
    download_local_models()
