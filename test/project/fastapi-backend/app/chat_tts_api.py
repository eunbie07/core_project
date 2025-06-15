from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests
from openai import OpenAI
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from io import BytesIO

# .env 환경변수 로드
load_dotenv()
router = APIRouter()

# API 키 설정
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # ElevenLabs 기본 여성 음성

# 키 유효성 확인
print("✅ ELEVEN_API_KEY 로드됨:", bool(ELEVEN_API_KEY))

# 요청/응답 모델 정의
class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str

# GPT만 사용하는 기존 엔드포인트
@router.post("/chat", response_model=ChatResponse)
def chat_with_gpt(req: ChatRequest):
    message = req.message

    gpt_messages = [
        {
            "role": "system",
            "content": "당신은 감정 소비를 이해하고 공감하며 따뜻한 조언을 해주는 챗봇입니다. 현실적이고 부드러운 대안을 제공합니다."
        },
        {
            "role": "user",
            "content": f"{message}\n\n세 문장 이내로 따뜻하게 말하면서 명확한 감정 해소 대안을 제시해줘."
        }
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=gpt_messages
        )
        reply = response.choices[0].message.content
        return ChatResponse(reply=reply)
    except Exception as e:
        return ChatResponse(reply=f"GPT 호출 중 오류가 발생했습니다: {str(e)}")


# GPT + TTS 동시 처리
@router.post("/chat-tts")
def chat_with_gpt_and_tts(req: ChatRequest):
    message = req.message

    # 1. GPT 응답 생성
    gpt_messages = [
        {
            "role": "system",
            "content": "당신은 감정 소비를 이해하고 공감하며 따뜻한 조언을 해주는 챗봇입니다. 현실적이고 부드러운 대안을 제공합니다."
        },
        {
            "role": "user",
            "content": f"{message}\n\n세 문장 이내로 따뜻하게 말하면서 명확한 감정 해소 대안을 제시해줘."
        }
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=gpt_messages
        )
        reply = response.choices[0].message.content.strip()
        print("🧠 GPT 응답:", reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GPT 호출 실패: {str(e)}")

    # 2. TTS 요청 준비
    if len(reply) > 4900:
        reply = reply[:4900]
        print("✂ 응답이 너무 길어 잘라냄")

    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    tts_headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    tts_payload = {
        "text": reply,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.7,
            "similarity_boost": 0.7
        }
    }

    # 3. ElevenLabs 호출
    try:
        tts_response = requests.post(tts_url, json=tts_payload, headers=tts_headers)
        print("🎤 TTS 응답 코드:", tts_response.status_code)

        if tts_response.status_code != 200:
            print("❌ TTS 응답 오류:", tts_response.text)
            raise Exception(f"TTS 오류 응답: {tts_response.text}")

        # 4. mp3 파일 StreamingResponse로 반환
        audio_stream = BytesIO(tts_response.content)
        return StreamingResponse(audio_stream, media_type="audio/mpeg")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS 생성 실패: {str(e)}")
