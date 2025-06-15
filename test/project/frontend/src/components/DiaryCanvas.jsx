// components/DiaryCanvas.jsx
import html2canvas from 'html2canvas';
import { useRef } from 'react';

const emojiMap = {
  joy: '😊',
  sad: '😢',
  anxious: '😱',
  stress: '😤',
  neutral: '😐',
};

const colorMap = {
  joy: '#E6E0FF',
  sad: '#DAD6FF',
  anxious: '#E4D9FF',
  stress: '#E7DBFF',
  neutral: '#F0EFFF',
};

export default function DiaryCanvas({ emotion, text }) {
  const ref = useRef();

  const downloadImage = async () => {
    const canvas = await html2canvas(ref.current);
    const link = document.createElement('a');
    link.download = 'emotion_diary.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '250px',
          borderRadius: '20px',
          backgroundColor: colorMap[emotion],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Apple SD Gothic Neo", sans-serif',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
          padding: '20px',
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: '60px', marginBottom: '15px' }}>
          {emojiMap[emotion] || '📝'}
        </div>
        <div style={{ fontSize: '18px', color: '#333' }}>{text}</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={downloadImage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          이미지 다운로드
        </button>
      </div>
    </div>
  );
}
