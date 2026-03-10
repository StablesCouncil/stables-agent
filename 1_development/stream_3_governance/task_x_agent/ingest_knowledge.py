import os
import glob
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Configuration
# Read strictly from 2_current for official documentation
STABLES_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DOC_DIR = os.path.join(STABLES_ROOT, "2_current")
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

def load_documents():
    print(f"Scanning for Markdown files in: {DOC_DIR}")
    md_files = glob.glob(os.path.join(DOC_DIR, "**", "*.md"), recursive=True)
    
    docs = []
    for file_path in md_files:
        try:
            loader = TextLoader(file_path, encoding='utf-8')
            docs.extend(loader.load())
        except Exception as e:
            print(f"Failed to load {file_path}: {e}")
            
    print(f"Found {len(docs)} documents.")
    return docs

def process_and_store():
    # 1. Load docs
    documents = load_documents()
    if not documents:
        print("No documents found. Exiting.")
        return

    # 2. Split logic (markdown specific if possible, but recursive is good)
    print("Splitting documents into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")

    # 3. Create Embeddings (Local model)
    print("Initializing embedding model (all-MiniLM-L6-v2)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 4. Generate and Store in Chroma
    print(f"Storing embeddings securely in ChromaDB at {CHROMA_DB_DIR}...")
    vectorstore = Chroma.from_documents(
        documents=chunks, 
        embedding=embeddings, 
        persist_directory=CHROMA_DB_DIR
    )
    vectorstore.persist()
    print("Knowledge base successfully ingested and saved!")

if __name__ == "__main__":
    process_and_store()
