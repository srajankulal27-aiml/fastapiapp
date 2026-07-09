import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

# Use environment variable `GROQ_MODEL` if provided, otherwise keep the
# existing default model string to avoid a breaking change.
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

try:
    llm = ChatGroq(
        model=GROQ_MODEL,
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.3,
    )
except Exception as exc:
    llm = None
    llm_init_error = exc

resume_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a professional resume analyser.
Analyse the given resume text and provide:
1. Key Skills found
2. Experience Level (Junior/Mid/Senior)
3. Strengths
4. Areas to Improve
5. Suggested Job Roles
Keep the analysis short and structured."""),
    ("human", "{resume_text}")
])
if llm is not None:
    resume_chain = resume_prompt | llm
else:
    resume_chain = None


def analyze_resume(resume_text: str) -> str:
    if resume_chain is None:
        msg = getattr(globals().get('llm_init_error', None), 'args', (None,))
        hint = (
            f"LLM initialization error: {msg[0]}" if msg[0] else "LLM not configured."
        )
        hint += " Set GROQ_MODEL to a supported model or check GROQ_API_KEY."
        return f"Resume service error: {hint}"

    try:
        response = resume_chain.invoke({"resume_text": resume_text})
    except Exception as exc:
        err_text = str(exc)
        fallback = os.getenv("GROQ_FALLBACK_MODEL")
        if "model_decommissioned" in err_text and fallback:
            try:
                temp_llm = ChatGroq(model=fallback, api_key=os.getenv("GROQ_API_KEY"), temperature=0.3)
                temp_chain = resume_prompt | temp_llm
                response = temp_chain.invoke({"resume_text": resume_text})
                return response.content
            except Exception as exc2:
                return f"Resume service error after fallback attempt: {exc2}"

        return f"Resume service error: {exc}"

    return response.content
