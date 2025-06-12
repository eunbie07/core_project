from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from app.tts_utils import generate_speech
import io

router = APIRouter()

@router.get("/tts")
def tts(text: str = Query(...)):
    audio_bytes = generate_speech(text)
    return StreamingResponse(io.BytesIO(audio_bytes), media_type="audio/mpeg")
