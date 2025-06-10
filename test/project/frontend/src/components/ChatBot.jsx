import { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
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
    } catch (error) {
      console.error('GPT 오류:', error);
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
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>리마인봇과 함께하는 소비 반성 챗봇</h3>

        <div style={{
          backgroundColor: '#f0f4ff',
          borderRadius: '12px',
          padding: '10px',
          height: '300px',
          overflowY: 'auto',
          marginBottom: '10px',
        }}>
          {history.map((item, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '10px',
                textAlign: item.role === 'user' ? 'right' : 'left',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  backgroundColor: item.role === 'user' ? '#d8d4ff' : '#e5f0ff',
                  maxWidth: '80%',
                }}
              >
                {item.content}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flexGrow: 1,
              padding: '8px 12px',
              borderRadius: '12px',
              border: '1px solid #ccc',
            }}
            placeholder="메시지를 입력하세요..."
          />
          <button onClick={handleSend}>보내기</button>
        </div>

        {history.length > 0 && history[history.length - 1].role === 'gpt' && (
          <div style={{ marginTop: '20px' }}>
            <p>방금 메시지의 감정을 선택해주세요:</p>
            {['기쁨', '우울', '스트레스', '무감정'].map((emo) => (
              <button
                key={emo}
                onClick={() => setEmotion(emo)}
                style={{
                  marginRight: '8px',
                  backgroundColor: emotion === emo ? '#b5bfff' : '#eee',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '12px',
                }}
              >
                {emo}
              </button>
            ))}

            {emotion && (
              <div style={{ marginTop: '10px' }}>
                <button onClick={handleSave}>감정 저장</button>
              </div>
            )}
            {saved && <p style={{ color: 'green' }}>저장 완료</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
