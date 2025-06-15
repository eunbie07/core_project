import express from 'express';
import cors from 'cors';
import chatbotRouter from './routes/chatbot.js';
import logsRouter from './routes/logs.js';
import convoRouter from './routes/convo.js';
import ttsRouter from './routes/tts.js';

const app = express();
app.use(cors());
app.use(express.json());

// 모든 라우터는 /api 접두어 유지
app.use('/api/chat', chatbotRouter);
app.use('/api/logs', logsRouter);
app.use('/api/log-convo', convoRouter);
app.use('/api/tts', ttsRouter);  // ✅ /api/tts로 요청

app.listen(8000, () => {
  console.log('✅ Node.js API Gateway on http://13.237.236.117:8000');
});
