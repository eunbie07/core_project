import express from 'express';
import cors from 'cors';
import chatbotRouter from './routes/chatbot.js';
import logsRouter from './routes/logs.js';
import convoRouter from './routes/convo.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', chatbotRouter);   // /api/chat
app.use('/api', logsRouter);      // /api/logs
app.use('/api', convoRouter);     // /api/log-convo

app.listen(8000, () => {
  console.log('Node.js API Gateway on http://54.206.43.191:8000');
});
