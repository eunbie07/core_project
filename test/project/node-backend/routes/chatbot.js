// routes/chatbot.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

// 기존: router.post('/chat', ...) ❌
// 수정: router.post('/', ...) ✅
router.post('/', async (req, res) => {
  try {
    const response = await axios.post('http://13.237.236.117:3000/chat', req.body);
    res.json(response.data);
  } catch (err) {
    console.error('FastAPI 프록시 오류:', err.message);
    res.status(500).json({ error: 'FastAPI 서버 응답 실패' });
  }
});

export default router;
