from dotenv import load_dotenv
import os
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

load_dotenv()

def test():
    try:
        print("\nTesting GoogleGenerativeAIEmbeddings...")
        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        vector = embeddings.embed_query("Hello world")
        print("Embeddings successful! Vector length:", len(vector))
        print("\nAll tests passed! The new API key works correctly.")
    except Exception as e:
        print("\nError:", e)

if __name__ == "__main__":
    test()
