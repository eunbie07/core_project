import { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]); // 전체 대화 저장
  const [emotion, setEmotion] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newHistory = [...history, { role: 'user', content: message }];
    setHistory(newHistory);
    setMessage('');
    setSaved(false);

    try {
      const res = await axios.post('http://localhost:3000/chat', { message });
      setHistory((prev) => [...prev, { role: 'gpt', content: res.data.reply }]);
    } catch (err) {
      console.error('GPT 오류', err);
    }
  };

  const handleSave = async () => {
    const lastUserMessage = history.filter((h) => h.role === 'user').slice(-1)[0];
    if (!lastUserMessage) return;

    await axios.post('http://localhost:3000/log', {
      user_id: 'user_female',
      date: new Date().toISOString().slice(0, 10),
      category: '기타',
      amount: 0,
      description: lastUserMessage.content,
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

      {/* 대화 내용 출력 */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '10px' }}>
        {history.map((item, idx) => (
          <div key={idx} style={{ marginBottom: '6px' }}>
            <strong>{item.role === 'user' ? '나' : 'GPT'}:</strong> {item.content}
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        cols={60}
        placeholder="질문을 입력하세요"
      />
      <br />
      <button onClick={handleSend}>보내기</button>

      {/* 감정 선택 */}
      {history.length > 0 && history[history.length - 1].role === 'gpt' && (
        <div style={{ marginTop: '12px' }}>
          <p>방금 메시지의 감정을 선택해주세요:</p>
          {['기쁨', '우울', '스트레스', '무감정'].map((emo) => (
            <button
              key={emo}
              onClick={() => setEmotion(emo)}
              style={{ marginRight: '5px', backgroundColor: emotion === emo ? '#ddd' : '#fff' }}
            >
              {emo}
            </button>
          ))}
          {emotion && <button onClick={handleSave}>감정 저장</button>}
          {saved && <p style={{ color: 'green' }}>저장 완료</p>}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
