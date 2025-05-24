const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 8000;

const FASTAPI_URL = 'http://fastapi:3000';

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/test', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/ping`);
    res.json(response.data);
  } catch (err) {
    res.status(500).send('FastAPI 연동 에러');
  }
});

app.listen(PORT, () => console.log(`Node.js server running on port ${PORT}`));
