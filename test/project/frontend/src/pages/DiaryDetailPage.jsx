import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import Layout from '../components/Layout';

const diaryEntries = [
  {
    date: '2025-05-10',
    text: '오늘은 충동적으로 옷을 샀다. 기분이 우울했지만, 막상 사고 나니 더 허무했다.',
    image: '/images/diary_stress_shopping.png',
  },
  {
    date: '2025-05-11',
    text: '스트레스를 풀기 위해 피자를 먹었지만, 후회가 남았다.',
    image: '/images/diary_sad_binge.png',
  },
  {
    date: '2025-05-12',
    text: '너무 지루해서 게임 아이템을 질렀다. 재미는 잠깐이었다.',
    image: '/images/diary_bored_gamebuy.png',
  }
];

export default function DiaryDetailPage() {
  const cardRefs = useRef([]);

  const handleDownloadCard = async (index) => {
    const el = cardRefs.current[index];
    if (!el) return;

    const canvas = await html2canvas(el);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${diaryEntries[index].date}_diary.png`;
    link.click();
  };

  return (
    <Layout
      center={
        <div style={{
          backgroundColor: '#f5f4fc',
          padding: '40px 20px',
          boxSizing: 'border-box',
        }}>
          <h2 style={{
            fontSize: '28px',
            marginBottom: '30px',
            color: '#4c4c7a',
            textAlign: 'center'
          }}>
            Emotion Diary
          </h2>

          {/* 카드 전체 묶는 flex 컨테이너 */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}>
            {diaryEntries.map((entry, index) => (
              <div
                key={index}
                style={{
                  flex: '0 0 calc((100% - 48px) / 3)', // 3개 고정 + gap 고려
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {/* 카드 내용 */}
                <div
                  ref={(el) => (cardRefs.current[index] = el)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '20px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    width: '80%',
                    minHeight: '340px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={entry.image}
                    alt="감정 일러스트"
                    style={{
                      width: '100%',
                      borderRadius: '16px',
                      marginBottom: '16px',
                    }}
                  />
                  <strong style={{ fontSize: '16px', color: '#444' }}>{entry.date}</strong>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginTop: '12px',
                    lineHeight: 1.5
                  }}>
                    {entry.text}
                  </p>
                </div>

                {/* 버튼 */}
                <button
                  onClick={() => handleDownloadCard(index)}
                  style={{
                    marginTop: '12px',
                    backgroundColor: '#6C63FF',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}
