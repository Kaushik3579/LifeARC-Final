import { useState, useEffect } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseChart from "@/components/ExpenseChart";
import SavingsGoal from "@/components/SavingsGoal";
import AIInsights from "@/components/AIInsights";

const Index = () => {
  const [expenseData, setExpenseData] = useState({
    income: 0,
    primaryExpenses: {},
    secondaryExpenses: {},
    investments: 0,
  });

  const [goalData, setGoalData] = useState({
    targetAmount: 0,
    timeframe: 0,
    currentSavings: 0,
  });

  const handleExpenseUpdate = (data) => {
    setExpenseData(data);
  };

  const handleGoalUpdate = (data) => {
    setGoalData(data);
  };

  useEffect(() => {
    const totalExpenses = Object.values(expenseData.primaryExpenses).reduce(
      (sum, value) => sum + (parseFloat(value) || 0),
      0
    ) + Object.values(expenseData.secondaryExpenses).reduce(
      (sum, value) => sum + (parseFloat(value) || 0),
      0
    );

    const currentSavings = expenseData.income - totalExpenses - expenseData.investments;
    setGoalData((prevGoalData) => ({
      ...prevGoalData,
      currentSavings: currentSavings > 0 ? currentSavings : 0,
    }));
  }, [expenseData]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Goal Tracker</h1>
          <p className="text-sm text-gray-500">
            Track your expenses and reach your financial goals
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ExpenseForm onUpdate={handleExpenseUpdate} />
            <SavingsGoal onUpdate={handleGoalUpdate} />
          </div>
          <div className="space-y-6">
            <ExpenseChart data={expenseData} />
            <AIInsights expenseData={expenseData} goalData={goalData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
