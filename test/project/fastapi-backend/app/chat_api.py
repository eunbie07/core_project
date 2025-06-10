# app/chat_api.py ← GPT 응답 생성

from fastapi import APIRouter
from pydantic import BaseModel
import openai
import os

router = APIRouter()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY", "sk-xxxxx"))

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
def chat_with_gpt(req: ChatRequest):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "너는 감정 소비를 조언해주는 따뜻한 챗봇이야."},
            {"role": "user", "content": req.message}
        ]
    )
    answer = response.choices[0].message.content
    return ChatResponse(reply=answer)
