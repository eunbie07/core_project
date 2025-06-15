import React, { useState } from 'react';
import axios from 'axios';

function BudgetCoach({ userId = "user_male" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCoaching = async () => {
    setLoading(true);
    setData(null);
    setError('');
    try {
      const res = await axios.get(`http://13.237.236.117:8000/api/coach/${userId}`);
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setData(res.data); // { budgets, saving_goal, tips }
      }
    } catch (err) {
      setError("AI 코치를 불러오는 중 오류가 발생했어요.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">💰 AI 소비 코치</h2>

      <button
        onClick={getCoaching}
        disabled={loading}
        className={`w-full px-4 py-2 mb-4 rounded font-semibold transition-colors 
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
      >
        {loading ? "소비 분석 중입니다..." : "소비 습관 분석 받기"}
      </button>

      {error && (
        <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
      )}

      {data && (
        <div className="space-y-6 mt-6">
          {data.budgets && (
            <div className="bg-gray-50 p-4 rounded shadow">
              <h3 className="font-bold mb-2">📦 카테고리별 예산안</h3>
              <ul className="text-sm">
                {Object.entries(data.budgets).map(([category, amount]) => (
                  <li key={category}>• {category}: {amount.toLocaleString()}원 이하</li>
                ))}
              </ul>
            </div>
          )}

          {"saving_goal" in data && (
            <div className="bg-green-100 p-4 rounded shadow">
              <h3 className="font-bold mb-2">🏦 저축 목표</h3>
              <p className="text-sm">{data.saving_goal.toLocaleString()}원 이상 저축해보세요.</p>
            </div>
          )}

          {Array.isArray(data.tips) && (
            <div className="bg-yellow-100 p-4 rounded shadow">
              <h3 className="font-bold mb-2">🎯 절약 팁</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {data.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BudgetCoach;
