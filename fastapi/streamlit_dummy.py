# streamlit_app.py

import streamlit as st
import requests
import datetime

st.set_page_config(page_title="AI 더미 소비데이터 생성기", page_icon="📊")
st.title("📊 AI 감정소비 더미데이터 생성기")

# 나이 입력
age = st.number_input("나이", min_value=10, max_value=100, value=30)

# 성별 라디오버튼
gender = st.radio("성별", ["남성", "여성"])

# 직업 라디오버튼
job = st.radio("직업", ["직장인", "대학생", "주부"])

# 관심사 체크박스
st.write("관심사 선택")
interest_options = ["커피", "영화", "쇼핑", "게임", "운동", "여행", "패션"]
interests = []
for option in interest_options:
    if st.checkbox(option):
        interests.append(option)

# 기간 설정
col1, col2 = st.columns(2)
with col1:
    start_date = st.date_input("시작일", value=datetime.date.today())
with col2:
    end_date = st.date_input("종료일", value=datetime.date.today())

# 제출 버튼
if st.button("더미데이터 생성"):
    # 최소 하나 이상 관심사 선택하도록 체크
    if len(interests) == 0:
        st.warning("관심사를 최소 1개 이상 선택해 주세요!")
    else:
        # API 호출
        persona = {
            "age": age,
            "gender": gender,
            "job": job,
            "interests": interests,
            "start_date": str(start_date),
            "end_date": str(end_date)
        }

        try:
            response = requests.post("http://localhost:3000/generate", json=persona)
            if response.status_code == 200:
                result = response.json()
                st.success("✅ 더미데이터 생성 성공!")
                st.json(result['data'])
            else:
                st.error(f"❌ API 호출 실패: {response.status_code}")
        except Exception as e:
            st.error(f"❌ 오류 발생: {e}")
