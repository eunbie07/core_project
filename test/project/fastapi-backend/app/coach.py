from fastapi import APIRouter
from openai import OpenAI
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from fastapi.responses import JSONResponse
import json

load_dotenv()
router = APIRouter()

# OpenAI API
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# MongoDB 연결
mongo = MongoClient("mongodb://localhost:27017")
collection = mongo.spending_db.spending_logs

@router.get("/coach/{user_id}")
def get_coaching(user_id: str):
    doc = collection.find_one({"user_id": user_id}, sort=[("month", -1)])
    if not doc:
        return {"error": "소비 데이터가 없습니다."}

    month = doc.get("month")
    data = doc.get("data", [])
    total_income = sum(item["amount"] for item in data if item["type"] == "income")
    total_expense = sum(item["amount"] for item in data if item["type"] == "expense")

    summary_lines = [
        f"{item['date']} - {item['type']} / {item['category']} / {item['amount']}원"
        for item in data
    ]
    summary_text = "\n".join(summary_lines)

    prompt = f"""
아래는 사용자의 월별 소비 내역입니다:

- 월: {month}
- 총 수입: {total_income}원
- 총 지출: {total_expense}원

[상세 내역]
{summary_text}

다음 JSON 형식만 출력해줘. **설명 문장 없이 JSON만 출력**해야 해.

예시:
{{
  "budgets": {{
    "식비": 300000,
    "쇼핑": 100000,
    "기타": 50000
  }},
  "saving_goal": 400000,
  "tips": [
    "불필요한 구독 정리",
    "배달 대신 요리하기",
    "소비 기록 습관 들이기"
  ]
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "너는 소비 코치이며, JSON 형식으로 예산안을 제공해야 해."},
                {"role": "user", "content": prompt}
            ]
        )
        raw_content = response.choices[0].message.content.strip()
        print("GPT 응답 내용:\n", raw_content)  # ✅ 로그 확인용

        # JSON 파싱 시도
        data = json.loads(raw_content)
        return JSONResponse(content=data)

    except json.JSONDecodeError:
        return {
            "error": "GPT 응답이 JSON 형식이 아닙니다.",
            "raw": raw_content  # 확인을 위해 응답 원문도 같이 보냄
        }
    except Exception as e:
        return {"error": f"GPT 호출 중 오류 발생: {str(e)}"}
