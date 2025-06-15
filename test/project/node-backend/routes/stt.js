// routes/stt.js
import express from 'express';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // 임시 저장 폴더

router.post('/', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post('http://localhost:3000/api/stt', form, {
      headers: form.getHeaders()
    });

    res.json(response.data);
  } catch (err) {
    console.error('STT 프록시 에러:', err.message);
    res.status(500).json({ error: 'STT 처리 실패' });
  } finally {
    fs.unlink(filePath, () => {}); // 파일 삭제
  }
});

export default router;
