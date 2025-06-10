import { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [emotion, setEmotion] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSend = async () => {
    const res = await axios.post('http://localhost:3000/chat', { message });
    setReply(res.data.reply);
    setSaved(false);
  };

  const handleSave = async () => {
    await axios.post('http://localhost:3000/log', {
      user_id: 'user_female',
      date: new Date().toISOString().slice(0, 10),
      category: '기타',
      amount: 0,
      description: message,
      emotion: {
        label: emotion,
        source: 'user',
      },
    });
    setSaved(true);
  };

  return (
    <div>
      <h2>감정 소비 챗봇</h2>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend}>보내기</button>

      {reply && <p>GPT 응답: {reply}</p>}

      {reply && (
        <div>
          <p>당시 감정을 선택해주세요:</p>
          {['기쁨', '우울', '스트레스', '무감정'].map((emo) => (
            <button key={emo} onClick={() => setEmotion(emo)}>
              {emo}
            </button>
          ))}
        </div>
      )}

      {emotion && <button onClick={handleSave}>저장하기</button>}
      {saved && <p>저장 완료!</p>}
    </div>
  );
};

export default ChatBot;
