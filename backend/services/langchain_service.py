import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.runnables import RunnableWithMessageHistory
    from langchain_community.chat_message_histories import ChatMessageHistory
except ImportError:
    ChatGroq = None
    ChatPromptTemplate = None
    RunnableWithMessageHistory = None
    ChatMessageHistory = None

store = {}
chat_with_memory = None
chat_service_error = None

if (
    ChatGroq is not None
    and ChatPromptTemplate is not None
    and RunnableWithMessageHistory is not None
):
    api_key = os.getenv("GROQ_API_KEY")
    if api_key:
        try:
            llm = ChatGroq(
                model="llama-3.3-70b-versatile",
                api_key=api_key,
                temperature=0.5,
            )
        except Exception as exc:
            chat_service_error = f"Failed to initialize the chat service: {exc}"
            llm = None
        else:
            prompt_with_memory = ChatPromptTemplate.from_messages(
                [
                    (
                        "system",
                        "You are a helpful AI career guidance assistant. Provide accurate and helpful advice.",
                    ),
                    ("placeholder", "{chat_history}"),
                    ("human", "{user_query}"),
                ]
            )

            chain_with_memory = prompt_with_memory | llm

            def get_history(session_id: str):
                if session_id not in store:
                    store[session_id] = ChatMessageHistory()
                return store[session_id]

            chat_with_memory = RunnableWithMessageHistory(
                runnable=chain_with_memory,
                get_session_history=get_history,
                input_messages_key="user_query",
                history_messages_key="chat_history",
            )
    else:
        chat_service_error = "Missing GROQ_API_KEY environment variable. Set it to enable AI chat responses."
else:
    chat_service_error = "The required LangChain dependencies are not installed."


def ask_career_chatbot_response(question: str, session_id: str = "default") -> str:
    if chat_with_memory is None:
        if chat_service_error:
            return f"The chat service is currently unavailable. {chat_service_error}"
        return "The chat service is currently unavailable."

    try:
        response = chat_with_memory.invoke(
            {"user_query": question},
            {"configurable": {"session_id": session_id}},
        )
    except Exception as exc:
        return f"The chat service encountered an error: {exc}"

    return response.content