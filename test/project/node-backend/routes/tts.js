import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3000/chat-tts', req.body, {
      responseType: 'arraybuffer', // mp3 바이너리 받기
    });

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.data);
  } catch (error) {
    console.error('TTS 에러:', error.message);
    res.status(500).json({ error: 'TTS 요청 실패' });
  }
});

export default router;
