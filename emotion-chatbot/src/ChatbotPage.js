import React, { useState } from 'react';
import './ChatbotPage.css';
import diaryImage from './chatbot_image_1.png';

export default function DiaryLandingPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="diary-container">
      <div className="left-panel">
        <h1>감정소비 다이어리</h1>
        <p>오늘의 소비와 감정을 기록하고 돌아볼 수 있는 나만의 감정소비 일기장 📔</p>
        <img src={diaryImage} alt="다이어리 일러스트" />
      </div>

      <div className="right-panel">
        <div className="tab-buttons">
          <button onClick={() => setIsRegister(false)} className={!isRegister ? 'active' : ''}>로그인</button>
          <button onClick={() => setIsRegister(true)} className={isRegister ? 'active' : ''}>회원가입</button>
        </div>

        {!isRegister ? <LoginForm /> : <RegisterForm />}
        <button className="start-btn">시작하기</button>
      </div>
    </div>
  );
}

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="form">
      <input type="text" placeholder="아이디" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} />
    </div>
  );
}

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="form">
      <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="text" placeholder="아이디" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} />
    </div>
  );
}
