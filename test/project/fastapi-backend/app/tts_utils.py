import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs # 여기서 ElevenLabs를 제대로 임포트했는지 확인
from elevenlabs import VoiceSettings

load_dotenv()

# client 인스턴스가 정확하게 생성되었는지 확인
client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

def generate_speech(text: str, voice_id: str = "Rachel") -> bytes:
    # client.generate() 호출이 맞는지 확인
    audio_stream = client.generate(
        text=text,
        voice=voice_id,
        model="eleven_monolingual_v1",
        stream=True,
        voice_settings=VoiceSettings(stability=0.5, similarity_boost=0.7)
    )
    return b"".join(audio_stream)