import { useState } from 'react'; // 추가
import ChatBot from '../components/ChatBot';

export default function ChatDetailPage() {
  const [showFullChat, setShowFullChat] = useState(false); // 상태 추가

  const colors = {
    bodyBackgroundColor: '#F3F6FF',
    cardBackgroundColor: '#FFFFFF',
    primaryAccentColor: '#7C8BFF',
    secondaryAccentColor: '#6FCF97',
    textColor: '#333333',
    lightTextColor: '#555555',
    borderColor: '#E0E0E0',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: '"Apple SD Gothic Neo", sans-serif',
      boxSizing: 'border-box',
      backgroundColor: colors.bodyBackgroundColor,
    }}>
      <div style={{ 
        maxWidth: '1000px',
        width: '100%',
        display: 'flex',
        gap: '30px',
      }}>
        {/* 왼쪽 섹션 */}
        <div style={{ 
          flex: 1,
          minWidth: '350px',
          backgroundColor: colors.cardBackgroundColor,
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '28px', marginBottom: '10px', color: colors.textColor }}>과거 나의 소비</h2>
            <p style={{ fontSize: '16px', color: colors.lightTextColor, marginBottom: '30px', lineHeight: '1.6' }}>
              아래 챗봇과의 대화를 통해 오늘의 소비를 돌아보고, 감정 상태를 함께 점검해보세요.
            </p>
          </div>

          <div style={{
            backgroundColor: colors.bodyBackgroundColor,
            border: `1px solid ${colors.borderColor}`,
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '15px'
          }}>
            <strong style={{ color: colors.textColor }}>지난 대화 요약</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px', color: colors.lightTextColor, lineHeight: '1.5' }}>
              <li>소비: 커피</li>
              <li>감정: 스트레스</li>
              <li>기분 변화: 변화없음</li>
              <li>GPT 조언: 산책으로 기분을 환기해보세요.</li>
            </ul>
          </div>

          {/* 🔽 버튼 추가 */}
          <button
            style={{
              backgroundColor: colors.primaryAccentColor,
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 'bold'
            }}
            onClick={() => setShowFullChat(prev => !prev)}
          >
            {showFullChat ? '요약만 보기' : '최근 대화 다시 보기'}
          </button>

          {/* 🔽 전체 대화 표시 영역 */}
          {showFullChat && (
            <div style={{
              marginTop: '15px',
              backgroundColor: '#FAFAFA',
              border: `1px solid ${colors.borderColor}`,
              padding: '15px',
              borderRadius: '10px',
              fontSize: '14px',
              color: colors.lightTextColor,
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              <p><strong>GPT:</strong> 오늘 어떤 소비를 하셨나요?</p>
              <p><strong>나:</strong> 커피를 마셨어요.</p>
              <p><strong>GPT:</strong> 당시 기분은 어땠나요?</p>
              <p><strong>나:</strong> 스트레스를 풀려고 마셨어요.</p>
              <p><strong>GPT:</strong> 산책을 통해 기분을 환기해보는 것도 도움이 될 수 있어요 :)</p>
            </div>
          )}
        </div>

        {/* 오른쪽 챗봇 섹션 */}
        <div style={{ 
          flex: 2,
          minWidth: '500px',
          backgroundColor: colors.cardBackgroundColor,
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          '--chat-primary-color': colors.primaryAccentColor,
          '--chat-text-color': colors.textColor,
          '--chat-light-text-color': colors.lightTextColor,
          '--chat-border-color': colors.borderColor,
          '--chat-background-color': colors.bodyBackgroundColor,
        }}>
          <ChatBot />
        </div>
      </div>
    </div>
  );
}
