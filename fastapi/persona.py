from fastapi import FastAPI
from pydantic import BaseModel
import ollama

# FastAPI 앱 생성
app = FastAPI()

# 입력 데이터 스키마 정의
class PersonaInput(BaseModel):
    name: str
    age: int
    gender: str
    interests: list

# 더미 데이터 생성 프롬프트 템플릿
def generate_dummy_data_prompt(persona: PersonaInput):
    prompt = f"""
    사용자 페르소나 정보를 바탕으로 JSON 형식의 더미 데이터를 생성해줘.
    
    - 이름: {persona.name}
    - 나이: {persona.age}
    - 성별: {persona.gender}
    - 관심사: {", ".join(persona.interests)}
    
    출력 예시:
    {{
        "소비성향": "...",
        "주요감정": "...",
        "최근소비": ["...", "...", "..."],
        "추천활동": ["...", "..."]
    }}
    
    JSON만 출력해줘.
    """
    return prompt

# POST 엔드포인트 작성
@app.post("/generate_dummy")
async def generate_dummy_data(persona: PersonaInput):
    prompt = generate_dummy_data_prompt(persona)
    
    # Ollama 호출 (로컬에서 llama3 사용 예시)
    response = ollama.chat(
        model="llama3",
        messages=[
            {"role": "system", "content": "너는 페르소나 데이터를 기반으로 더미데이터를 생성하는 도우미야."},
            {"role": "user", "content": prompt}
        ]
    )
    
    # Ollama 응답에서 생성된 답변 추출
    dummy_data = response['message']['content']

    # JSON 응답 반환
    return {"dummy_data": dummy_data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("persona:app", host="0.0.0.0", port=3000, reload=True)