import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    // FastAPI 서버 주소를 localhost로 변경
    const response = await axios.post('http://54.206.43.191:3000/chat', req.body);
    res.json(response.data);
  } catch (err) {
    console.error('FastAPI 프록시 오류:', err.message);
    res.status(500).json({ error: 'FastAPI 서버 응답 실패' });
  }
});

export default router;