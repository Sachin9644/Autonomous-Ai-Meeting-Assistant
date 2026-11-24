from dotenv import load_dotenv
import os
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

def test():
    try:
        client = genai.Client(api_key=api_key)
        
        print("Testing direct Google GenAI SDK chat...")
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents='Hello, who are you?'
        )
        print("Chat successful!")
        
        print("\nTesting direct Google GenAI SDK embeddings...")
        result = client.models.embed_content(
            model='text-embedding-004',
            contents='Hello world'
        )
        print("Embeddings successful! Vector length:", len(result.embeddings[0].values))
        print("\nAll direct tests passed!")
    except Exception as e:
        print("\nError:", e)

if __name__ == "__main__":
    test()
