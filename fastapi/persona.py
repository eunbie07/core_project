from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List
import json, os
import ollama

app = FastAPI()

# 저장 폴더
OUTPUT_FOLDER = "dummy_data"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# 입력 스키마
class PersonaInput(BaseModel):
    age: int = Field(..., description="나이")
    gender: str = Field(..., description="성별 (남성/여성)")
    job: str = Field(..., description="직업 (직장인, 대학생 등)")
    interests: List[str] = Field(..., description="관심사 리스트")
    start_date: str
    end_date: str

# 프롬프트 생성
def create_prompt(persona: PersonaInput):
    prompt = f"""
너는 더미 소비내역 데이터를 생성하는 도우미야.
사용자 정보:
- 나이: {persona.age}
- 성별: {persona.gender}
- 직업: {persona.job}
- 관심사: {", ".join(persona.interests)}
- 기간: {persona.start_date} ~ {persona.end_date}

이 정보를 바탕으로 하루 소비내역을 날짜별로 JSON으로 출력해.
JSON 예시:
{{
  "소비내역": [
    {{
      "날짜": "2024-01-01",
      "소비": [
        {{
          "시간": "09:00",
          "항목명": "커피",
          "금액": 4500,
          "카테고리": "음식/음료"
        }}
      ]
    }}
  ]
}}
"""
    return prompt

# FastAPI 엔드포인트
@app.post("/generate")
async def generate_dummy(persona: PersonaInput):
    prompt = create_prompt(persona)

    response = ollama.chat(
        model="llama3.2:latest",  # 본인이 설치한 ollama 모델명에 맞춰서!
        messages=[
            {"role": "system", "content": "너는 JSON 생성 전문 AI야."},
            {"role": "user", "content": prompt}
        ]
    )

    dummy_str = response['message']['content']
    try:
        dummy_json = json.loads(dummy_str)
    except:
        return {"error": "JSON 파싱 실패", "response": dummy_str}

    # 파일명: 성별_나이_직업.json 로 저장
    filename = f"{persona.gender}_{persona.age}_{persona.job}.json"
    filepath = os.path.join(OUTPUT_FOLDER, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(dummy_json, f, ensure_ascii=False, indent=4)

    return {"file_path": filepath, "data": dummy_json}


# FastAPI 서버 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("persona:app", host="0.0.0.0", port=3000, reload=True)
