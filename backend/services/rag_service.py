import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from services.qdrant_service import search_jobs

load_dotenv()

# Allow overriding the Groq model via environment variable `GROQ_MODEL`.
# Keep the existing default to avoid a breaking change; set `GROQ_MODEL` in
# .env to switch to a supported model without editing code.
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
try:
    llm = ChatGroq(
    model=GROQ_MODEL,
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY"),
)
except Exception as exc:
    # Defer runtime errors to invocation time; constructing llm may fail if
    # the model is decommissioned or API key is missing. We'll allow the
    # rag_chain invocation to surface a clear error message instead of
    # crashing the whole app at import time.
    llm = None
    llm_init_error = exc
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a job search assistant..
Use the following job listings retrieved from the database to answer 
If no relevant jobs are found, say so clearly.

Retrieved Jobs:
{context} """),
    ("human","{question}")
])

if llm is not None:
    rag_chain = rag_prompt | llm
else:
    rag_chain = None

def rag_job_search(query: str) -> str:
    results = search_jobs(query, top_k=5)
    if not results:
        return "No jobs found in the database. Please embed jobs first using the embed_jobs endpoint."
    context="\n".join([
        f"-{r['title']} (Salary: {r['salary']})\n{r['description']}" for r in results
    ])
    if rag_chain is None:
        # llm failed to initialize at import time (e.g., invalid model or missing API key)
        msg = getattr(globals().get('llm_init_error', None), 'args', (None,))
        hint = (
            f"LLM initialization error: {msg[0]}" if msg[0] else "LLM not configured."
        )
        hint += " Set GROQ_MODEL to a supported model or check GROQ_API_KEY."
        return f"RAG service error: {hint}"

    try:
        response = rag_chain.invoke({"context": context, "question": query})
    except Exception as exc:
        # If the model was decommissioned, allow an automatic retry using
        # GROQ_FALLBACK_MODEL if provided in the environment.
        err_text = str(exc)
        fallback = os.getenv("GROQ_FALLBACK_MODEL")
        if "model_decommissioned" in err_text and fallback:
            try:
                temp_llm = ChatGroq(
                    model=fallback,
                    temperature=0,
                    api_key=os.getenv("GROQ_API_KEY")
)
                temp_chain = rag_prompt | temp_llm
                response = temp_chain.invoke({"context": context, "question": query})
                return response.content
            except Exception as exc2:
                return f"RAG service error after fallback attempt: {exc2}"

        # Return a user-friendly message instead of raising a 500
        return f"RAG service error: {exc}"

    return response.content
