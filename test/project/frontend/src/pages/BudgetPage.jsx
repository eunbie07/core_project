import React from 'react';
import Layout from '../components/Layout';
import BudgetCoach from '../components/BudgetCoach';
import BudgetSummaryCard from '../components/BudgetSummaryCard';
import BudgetChart from '../components/BudgetChart';
import SavingGoalCard from '../components/SavingGoalCard';
import TipList from '../components/TipList';

function BudgetPage() {
  const income = 2500000;
  const expense = 1980000;

  return (
    <Layout
      left={
        <>
          <BudgetSummaryCard income={income} expense={expense} />
          <BudgetChart />
        </>
      }
      center={
        <BudgetCoach userId="user_male" />
      }
      right={
        <>
          <SavingGoalCard goal={500000} />
          <TipList />
        </>
      }
    />
  );
}

export default BudgetPage;
