import { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [step, setStep] = useState(1);
  const [spending, setSpending] = useState('');
  const [emotion, setEmotion] = useState('');
  const [effect, setEffect] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [history, setHistory] = useState([]);

  const user_id = "user_female";

  // 대화 말풍선 추가
  const addBotMessage = (text) => {
    setHistory((prev) => [...prev, { role: 'bot', content: text }]);
  };

  const addUserMessage = (text) => {
    setHistory((prev) => [...prev, { role: 'user', content: text }]);
  };

  // 1단계: 소비 내용 제출
  const handleSubmitSpending = () => {
    if (!spending.trim()) return;
    addUserMessage(spending);
    addBotMessage("그 소비를 하신 이유나 기분은 어땠나요?");
    setStep(2);
  };

  // 2단계: 감정 선택
  const handleSelectEmotion = (e) => {
    addUserMessage(e);
    setEmotion(e);
    addBotMessage("그 소비 이후 기분은 어땠나요?");
    setStep(3);
  };

  // 3단계: 감정 결과 선택
  const handleSelectEffect = async (e) => {
    addUserMessage(e);
    setEffect(e);
    setStep(4);

    const prompt = `
      사용자가 '${spending}'라는 소비를 했고,
      그 이유는 '${emotion}' 때문이었어요.
      하지만 그 소비 후 감정은 '${e}'였어요.
      이 사용자가 다음엔 감정을 더 건강하게 해소할 수 있도록 따뜻하게 조언해줘.
    `;

    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        user_id,
        message: prompt,
      });
      const reply = res.data.reply;
      setRecommendation(reply);
      addBotMessage(reply);

      await axios.post("http://localhost:8000/api/log-convo", {
        user_id,
        date: new Date().toISOString().slice(0, 10),
        history: [
          { role: "system", content: "4단계 감정 소비 반성 대화" },
          { role: "user", content: spending },
          { role: "user", content: emotion },
          { role: "user", content: e },
          { role: "gpt", content: reply }
        ]
      });

    } catch (err) {
      addBotMessage("GPT 응답 오류가 발생했어요.");
      console.error("GPT 오류", err);
    }
  };

  const reset = () => {
    setSpending('');
    setEmotion('');
    setEffect('');
    setRecommendation('');
    setHistory([]);
    setStep(1);
    addBotMessage("오늘 어떤 소비를 하셨나요?");
  };

  // 초기 메시지
  if (history.length === 0 && step === 1) {
    addBotMessage("오늘 어떤 소비를 하셨나요?");
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>감정 소비 반성 챗봇</h3>

      <div style={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: '#f4f6ff',
        borderRadius: '12px',
        marginBottom: '12px',
        maxHeight: '400px'
      }}>
        {history.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: item.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '8px'
          }}>
            <div style={{
              backgroundColor: item.role === 'user' ? '#d7d0ff' : '#e3f0ff',
              borderRadius: '16px',
              padding: '10px 14px',
              maxWidth: '70%'
            }}>
              {item.content}
            </div>
          </div>
        ))}
      </div>

      {/* 입력 또는 선택 UI */}
      {step === 1 && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={spending}
            onChange={(e) => setSpending(e.target.value)}
            placeholder="예: 카페, 옷, 배달 등"
            style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '12px' }}
          />
          <button onClick={handleSubmitSpending}>전송</button>
        </div>
      )}

      {step === 2 && (
        <div>
          {["스트레스", "보상심리", "충동", "무기력", "습관"].map((e) => (
            <button
              key={e}
              onClick={() => handleSelectEmotion(e)}
              style={{ margin: '4px' }}
            >{e}</button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div>
          {["좋아짐", "변화없음", "더 안좋아짐"].map((e) => (
            <button
              key={e}
              onClick={() => handleSelectEffect(e)}
              style={{ margin: '4px' }}
            >{e}</button>
          ))}
        </div>
      )}

      {step === 4 && recommendation && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <button onClick={reset}>다시 시작하기</button>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
