// server.js
import express from 'express';
import cors from 'cors';
import chatbotRouter from './routes/chatbot.js';
import logsRouter from './routes/logs.js';
import convoRouter from './routes/convo.js';
import ttsRouter from './routes/tts.js';
import sttRouter from './routes/stt.js';
import coachRouter from './routes/coach.js';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 라우터 접두어는 그대로
app.use('/api/chat', chatbotRouter);
app.use('/api/logs', logsRouter);
app.use('/api/log-convo', convoRouter);
app.use('/api/tts', ttsRouter);
app.use('/api/stt', sttRouter);
app.use('/api/coach', coachRouter);

app.listen(8000, () => {
  console.log('✅ Node.js API Gateway on http://13.237.236.117:8000');
});
