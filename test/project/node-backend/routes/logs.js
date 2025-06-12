import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/logs', async (req, res) => {
  try {
    const response = await axios.get('http://13.237.236.117:3000/logs', { params: req.query });
    res.json(response.data);
  } catch (err) {
    console.error('프록시 /logs 오류:', err.message);
    res.status(500).json({ error: 'FastAPI /logs 응답 실패' });
  }
});

export default router;