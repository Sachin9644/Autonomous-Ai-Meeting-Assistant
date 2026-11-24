import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

def test_groq_and_hf():
    try:
        print("Testing ChatGroq...")
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("Error: GROQ_API_KEY not found in .env")
            return
            
        llm = ChatGroq(model="llama-3.1-8b-instant", api_key=api_key)
        res = llm.invoke("Hello, say 'Groq is working!'")
        print("Chat successful! Response:", res.content)
        
        print("\nTesting HuggingFaceEmbeddings (this might download the model on first run)...")
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vector = embeddings.embed_query("Hello world")
        print("Embeddings successful! Vector length:", len(vector))
        
        print("\nAll tests passed successfully! The RAG pipeline is ready to use Groq and HuggingFace.")
    except Exception as e:
        print("\nError:", e)

if __name__ == "__main__":
    test_groq_and_hf()
