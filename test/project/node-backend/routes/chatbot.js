const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { message } = req.body;
  const reply = `이건 테스트 응답입니다: "${message}" 잘 받았어요.`;
  res.json({ reply });
});

module.exports = router;
