import React, { useState } from 'react';
import './ChatbotPage.css';

export default function EmotionChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: '안녕하세요! 오늘 소비하신 이유를 함께 나눠볼까요?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [
      ...messages,
      { role: 'user', text: input },
      { role: 'bot', text: '감정에 따른 소비 같아요. 조금 더 이야기해볼까요?' },
    ];
    setMessages(newMessages);
    setInput('');
  };

  return (
    <div className="page-container">
      <header className="topbar">
        <h1>💸 감정소비 리마인더 - 마음이</h1>
      </header>

      <main className="dashboard">
        {/* 분석 카드 */}
        <section className="card analysis-card">
          <h2>📊 감정 소비 분석</h2>
          <div className="bars">
            <div className="bar bar-1"><span>우울 65%</span></div>
            <div className="bar bar-2"><span>불안 40%</span></div>
            <div className="bar bar-3"><span>기쁨 30%</span></div>
          </div>
          <p className="insight">최근 우울할 때 소비가 자주 발생하고 있어요.</p>
        </section>

        {/* 챗봇 카드 */}
        <section className="card chatbot-card">
          <h2>🤖 마음이 챗봇</h2>
          <div className="chatbox">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <span className="bubble">{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="오늘 소비한 이유는?"
            />
            <button onClick={handleSend}>전송</button>
          </div>
        </section>

        {/* 소비 일기 카드 */}
        <section className="card diary-card">
          <h2>📔 소비 일기</h2>
          <div className="entry">
            <p>감정: 😢 우울</p>
            <p>소비 이유: 스트레스를 풀기 위해</p>
            <p className="memo">오늘은 기분 전환을 위해 평소보다 많은 돈을 썼어요.</p>
          </div>
          <button className="share-btn">일기 공유하기</button>
        </section>
      </main>
    </div>
  );
}
