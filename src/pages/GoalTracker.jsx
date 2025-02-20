import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, db, doc, getDoc } from "@/firebase"; // Import Firebase
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseChart from "@/components/ExpenseChart";
import SavingsGoal from "@/components/SavingsGoal";
import AIInsights from "@/components/AIInsights";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const Index = () => {
  const navigate = useNavigate();
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

  // Fetch user expenses from Firebase
  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          if (userData.expenses) {
            setExpenseData(userData.expenses);
          }
        }
      }
    };

    fetchExpenses();
  }, []);

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
      <NavigationMenu className="max-w-screen-xl mx-auto mb-6">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className="px-4 py-2 hover:bg-gray-100 rounded-md" 
              onClick={() => navigate('/monthly-tracker')}
            >
              Monthly Expense Tracker
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="px-4 py-2 hover:bg-gray-100 rounded-md" onClick={() => navigate('/financial-advisor')}>
              Financial Advisor
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className="px-4 py-2 hover:bg-gray-100 rounded-md" 
              onClick={() => navigate('/taxEstimator')}
            >
              Tax Estimator
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className="px-4 py-2 hover:bg-gray-100 rounded-md" onClick={() => navigate('/scenario-planning')}>
              Current Status
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
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
            <ExpenseChart data={expenseData} />  {/* Automatically updates */}
            <AIInsights expenseData={expenseData} goalData={goalData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
