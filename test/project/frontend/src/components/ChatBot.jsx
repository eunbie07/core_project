import { useState } from 'react';
import axios from 'axios';
import {
  ChatContainer,
  ChatHeader,
  ChatArea,
  MessageBox,
  MessageText,
  MessageMeta,
  InputArea,
  Button,
  DotLoader,
  NameTag
} from './ChatStyles';

const ChatBot = () => {
  const [step, setStep] = useState(1);
  const [spending, setSpending] = useState('');
  const [emotion, setEmotion] = useState('');
  const [effect, setEffect] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const user_id = "user_female";

  const getTime = () => new Date().toTimeString().slice(0, 5);

  const addMessage = (role, content) => {
    setHistory((prev) => [...prev, { role, content, time: getTime() }]);
  };

  const handleSubmitSpending = () => {
    if (!spending.trim()) return;
    addMessage('user', spending);
    addMessage('bot', "그 소비를 하신 이유나 기분은 어땠나요?");
    setSpending('');
    setStep(2);
  };

  const handleSelectEmotion = (e) => {
    addMessage('user', e);
    setEmotion(e);
    addMessage('bot', "그 소비 이후 기분은 어땠나요?");
    setStep(3);
  };

  const handleSelectEffect = async (e) => {
    addMessage('user', e);
    setEffect(e);
    setStep(4);

    const prompt = `
      사용자가 '${spending}'라는 소비를 했고,
      그 이유는 '${emotion}' 때문이었어요.
      하지만 그 소비 후 감정은 '${e}'였어요.
      이 사용자가 다음엔 감정을 더 건강하게 해소할 수 있도록 따뜻하게 조언해줘.
    `;

    setLoading(true);
    addMessage('bot', null); // 로딩 중

    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        user_id,
        message: prompt,
      });

      const reply = res.data.reply;
      setRecommendation(reply);

      setHistory((prev) => [
        ...prev.slice(0, -1),
        { role: 'bot', content: reply, time: getTime() }
      ]);

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
      setHistory((prev) => [
        ...prev.slice(0, -1),
        { role: 'bot', content: "GPT 응답 오류가 발생했어요.", time: getTime() }
      ]);
      console.error("GPT 오류", err);
    }

    setLoading(false);
  };

  const reset = () => {
    setSpending('');
    setEmotion('');
    setEffect('');
    setRecommendation('');
    setHistory([]);
    setStep(1);
    addMessage('bot', "오늘 어떤 소비를 하셨나요?");
  };

  if (history.length === 0 && step === 1) {
    addMessage('bot', "오늘 어떤 소비를 하셨나요?");
  }

  return (
    <ChatContainer>
      <ChatHeader>감정 소비 반성 챗봇</ChatHeader>

      <ChatArea>
        {history.map((item, idx) => (
          <MessageBox key={idx} align={item.role === 'user' ? 'right' : 'left'}>
            <NameTag>{item.role === 'user' ? '나' : 'Chatbot'}</NameTag>
            {item.content !== null ? (
              <>
                <MessageText bg={item.role === 'user' ? '#d7d0ff' : '#e3f0ff'}>
                  {item.content}
                </MessageText>
                <MessageMeta>{item.time}</MessageMeta>
              </>
            ) : (
              <DotLoader>
                <span></span><span></span><span></span>
              </DotLoader>
            )}
          </MessageBox>
        ))}
      </ChatArea>

      {/* STEP 1: 소비 입력 */}
      {step === 1 && (
        <InputArea>
          <input
            value={spending}
            onChange={(e) => setSpending(e.target.value)}
            placeholder="예: 카페, 옷, 배달 등"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmitSpending();
            }}
            disabled={loading}
          />
          <Button onClick={handleSubmitSpending} disabled={loading}>전송</Button>
        </InputArea>
      )}

      {/* STEP 2: 감정 선택 */}
      {step === 2 && (
        <InputArea>
          {["스트레스", "보상심리", "충동", "무기력", "습관"].map((e) => (
            <Button key={e} onClick={() => handleSelectEmotion(e)} disabled={loading}>{e}</Button>
          ))}
        </InputArea>
      )}

      {/* STEP 3: 기분 변화 선택 */}
      {step === 3 && (
        <InputArea>
          {["좋아짐", "변화없음", "더 안좋아짐"].map((e) => (
            <Button key={e} onClick={() => handleSelectEffect(e)} disabled={loading}>{e}</Button>
          ))}
        </InputArea>
      )}

      {/* STEP 4: 다시 시작 */}
      {step === 4 && recommendation && (
        <InputArea>
          <Button onClick={reset} disabled={loading}>다시 시작하기</Button>
        </InputArea>
      )}
    </ChatContainer>
  );
};

export default ChatBot;
