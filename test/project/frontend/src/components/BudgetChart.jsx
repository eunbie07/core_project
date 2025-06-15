// src/components/BudgetChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const BudgetChart = () => {
  const data = [
    { category: '식비', amount: 320000 },
    { category: '교통', amount: 80000 },
    { category: '쇼핑', amount: 150000 },
    { category: '게임', amount: 50000 }
  ];

  return (
    <BarChart width={400} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" fill="#6C63FF" />
    </BarChart>
  );
};

export default BudgetChart; // ✅ default export 추가
