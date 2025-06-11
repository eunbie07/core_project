from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv; load_dotenv();

from app.chat_api import router as chat_router
from app.log_api import router as log_router
from app.logs_api import router as logs_router
from app.convo_log_api import router as convo_log_router


app = FastAPI()

# ✅ CORS 허용 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 또는 ["http://54.206.43.191:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(log_router)
app.include_router(logs_router)
app.include_router(convo_log_router)