from fastapi import FastAPI, HTTPException, Form
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Optional
import random, calendar, json
from datetime import datetime
from dateutil.relativedelta import relativedelta
import pandas as pd
from pathlib import Path
import uvicorn

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

region_df = pd.read_csv(DATA_DIR / '지역별_소비자물가지수.csv', encoding='utf-8')
cpi_region = {row['시도별']: row['2025.05'] / 100 for _, row in region_df.iterrows()}
item_df = pd.read_csv(DATA_DIR / '지역별_품목별_물가지수.csv', encoding='utf-8')
cpi_item = {(row['시도별'], row['품목별']): row['2025.05'] / 100 for _, row in item_df.iterrows()}

def random_date_in_month(year: int, month: int) -> str:
    day = random.randint(1, calendar.monthrange(year, month)[1])
    return f"{year:04d}-{month:02d}-{day:02d}"

class Transaction(BaseModel):
    date: str
    type: str
    category: str
    amount: str     
    description: str   

class Persona(BaseModel):
    gender:       str
    age:          str
    location:     str
    month_income: int
    income_level: int
    life_stage:   str  

stage_profiles = {
    "직장인": [
        {"name":"외식","avg_count":10,"avg_amount":30000},
        {"name":"카페/음료","avg_count":15,"avg_amount":7000},
        {"name":"교통","avg_count":20,"avg_amount":2500},
        {"name":"쇼핑","avg_count":5,"avg_amount":80000},
        {"name":"문화/예술","avg_count":3,"avg_amount":35000},
    ],
    "주부": [
        {"name":"식료품","avg_count":12,"avg_amount":40000},
        {"name":"공공서비스","avg_count":4,"avg_amount":100000},
        {"name":"교통","avg_count":10,"avg_amount":2000},
        {"name":"쇼핑","avg_count":6,"avg_amount":70000},
        {"name":"취미/생활","avg_count":5,"avg_amount":30000},
    ],
    "학생": [
        {"name":"외식","avg_count":6,"avg_amount":20000},
        {"name":"카페/음료","avg_count":8,"avg_amount":5000},
        {"name":"교통","avg_count":15,"avg_amount":1500},
        {"name":"문화/예술","avg_count":4,"avg_amount":20000},
        {"name":"온라인쇼핑","avg_count":3,"avg_amount":40000},
    ]
}

def generate_transactions(
    gender: str, age: str, location: str,
    month_income: int, income_level: int, life_stage: str,
    start_month: str = "2025-05", months: int = 1
) -> List[Transaction]:
    year, mon = map(int, start_month.split("-"))
    ratios = {1:(0.55,0.45),2:(0.50,0.50),3:(0.45,0.55),4:(0.40,0.60),5:(0.35,0.65)}
    fixed_ratio, variable_ratio = ratios.get(income_level, (0.4,0.6))
    inc = month_income

    categories = stage_profiles.get(life_stage, stage_profiles['직장인'])

    txns: List[Transaction] = []
    for i in range(months):
        cur = datetime(year, mon, 1) + relativedelta(months=i)
        y, m = cur.year, cur.month
        ym = f"{y:04d}-{m:02d}"

        amt_str = f"{inc:,}원"
        txns.append(Transaction(
            date=f"{ym}-01",
            type="income",
            category="월급",
            amount=amt_str,
            description=f"{ym}월 월급 (세후)"
        ))

        fixed_amt = int(inc * fixed_ratio)
        amt_str = f"{fixed_amt:,}원"
        txns.append(Transaction(
            date=f"{ym}-05",
            type="expense",
            category="고정비",
            amount=amt_str,
            description="렌트·관리비·통신비 등 고정비"
        ))

        coef_r = cpi_region.get(location, 1.0)
        for cat in categories:
            for _ in range(cat['avg_count']):
                coef_i = cpi_item.get((location, cat['name']), 1.0)
                base = cat['avg_amount']
                real_amt = int(base * random.uniform(0.8,1.2) * coef_r * coef_i)
                amt_str = f"{real_amt:,}원"
                detail = f"{age} {life_stage}의 {cat['name']} 지출 (기준 {base:,}원)"
                txns.append(Transaction(
                    date=random_date_in_month(y,m),
                    type="expense",
                    category=cat['name'],
                    amount=amt_str,
                    description=detail
                ))

    txns.sort(key=lambda x: x.date)
    return txns

app = FastAPI(title="Dummy API")

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

@app.post("/generate", response_model=List[Transaction])
def generate(
    gender: str = Form(...),
    age: str = Form(...),
    location: str = Form(...),
    month_income: int = Form(...),
    income_level: int = Form(..., ge=1, le=5),
    life_stage: str = Form(...),
    start_month: str = Form("2025-05"),
    months: int = Form(1),
):
    try:
        txns = generate_transactions(
            gender, age, location,
            month_income, income_level, life_stage,
            start_month, months
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    filename = f"dummy_{age}_{gender}{life_stage}_{location.replace(' ','')}.json"
    with open(BASE_DIR / filename, "w", encoding="utf-8") as f:
        json.dump([t.dict() for t in txns], f, ensure_ascii=False, indent=2)
    return txns

if __name__ == "__main__":
    uvicorn.run("persona:app", host="0.0.0.0", port=3000, reload=True)
