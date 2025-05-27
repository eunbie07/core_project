// emotionChatbotUtils.js

// 추후 확장할 유틸 함수 예시
export const analyzeEmotion = (text) => {
  if (text.includes("우울") || text.includes("힘들")) return "우울";
  if (text.includes("짜증") || text.includes("불안")) return "불안";
  if (text.includes("기쁘")) return "기쁨";
  return "기타";
};

export const suggestAction = (emotion) => {
  switch (emotion) {
    case "우울":
      return ["명상 앱 실행", "산책하기", "좋아하는 음악 듣기"];
    case "불안":
      return ["호흡 명상", "저널 쓰기"];
    case "기쁨":
      return ["축하 메시지 남기기", "좋은 기억 저장"];
    default:
      return ["자기 감정 적어보기"];
  }
};
