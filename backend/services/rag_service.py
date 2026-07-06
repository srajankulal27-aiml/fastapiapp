import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from services.qdrant_service import search_jobs

load_dotenv()

llm = ChatGroq(
    model="llama3-70b-8192",
    temperature=0,
    groq_api_key=os.getenv("GROQ_API_KEY")
)
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a job search assistant..
Use the following job listings retrieved from the database to answer 
If no relevant jobs are found, say so clearly.

Retrieved Jobs:
{context} """),
    ("human","{question}")
])

rag_chain = rag_prompt | llm

def rag_job_search(query: str) -> str:
    results = search_jobs(query, top_k=5)
    if not results:
        return "No jobs found in the database. Please embed jobs first using the embed_jobs endpoint."
    context="\n".join([
        f"-{r['title']} (Salary: {r['salary']})\n{r['description']}" for r in results
    ])
    response = rag_chain.invoke({"context": context, "question": question})
    return response.content
