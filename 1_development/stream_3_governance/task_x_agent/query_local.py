import os
import argparse
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

def query_knowledge_base(query_text, k=3):
    print(f"Loading vector store from {CHROMA_DB_DIR}...")
    
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = Chroma(persist_directory=CHROMA_DB_DIR, embedding_function=embeddings)
    
    print(f"\nSearching for: '{query_text}'\n")
    results = vectorstore.similarity_search_with_score(query_text, k=k)
    
    if not results:
        print("No relevant context found.")
        return

    for i, (doc, score) in enumerate(results):
        source = doc.metadata.get('source', 'Unknown Source')
        print(f"--- Result {i+1} (Score: {score:.4f}) ---")
        print(f"Source: {source}")
        print(f"Content:\n{doc.page_content}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Query the Stables Knowledge Base")
    parser.add_argument("query", type=str, help="The question or topic to search for")
    parser.add_argument("--k", type=int, default=3, help="Number of chunks to return")
    args = parser.parse_args()
    
    query_knowledge_base(args.query, k=args.k)
