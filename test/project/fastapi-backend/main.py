# main.py

from fastapi import FastAPI
from app.chat_api import router as chat_router
from app.log_api import router as log_router
from app.logs_api import router as logs_router

app = FastAPI()

app.include_router(chat_router)
app.include_router(log_router)
app.include_router(logs_router)
