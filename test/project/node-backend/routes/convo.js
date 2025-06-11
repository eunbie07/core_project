import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/log-convo', async (req, res) => {
  try {
    const response = await axios.post('http://54.206.43.191:3000/log-convo', req.body); // 도커 환경
    res.json(response.data);
  } catch (err) {
    console.error('프록시 /log-convo 오류:', err.message);
    res.status(500).json({ error: 'FastAPI /log-convo 응답 실패' });
  }
});

export default router;
