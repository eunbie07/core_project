const express = require('express');
const app = express();
const chatbotRouter = require('./routes/chatbot');

app.use(express.json());
app.use('/chat', chatbotRouter);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Node.js server is running at http://localhost:${PORT}`);
});
// 