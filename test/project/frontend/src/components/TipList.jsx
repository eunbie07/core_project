import React from 'react';

function TipList() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">📝 절약 팁</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
        <li>홈카페로 커피 지출 줄이기</li>
        <li>구독 서비스 점검하기</li>
        <li>장 보며 충동구매 줄이기</li>
      </ul>
    </div>
  );
}

export default TipList;
