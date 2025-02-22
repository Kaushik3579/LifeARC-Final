import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, db, doc, getDoc, setDoc, signInWithGoogle, signOutUser } from "@/firebase";
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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const GoalTracker = () => {
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

  const [monthlySavings, setMonthlySavings] = useState({});
  const [newSaving, setNewSaving] = useState({
    month: "",
    amount: "",
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchData(user.uid);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async (uid) => {
    const docRef = doc(db, "goalTracker", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setExpenseData(data.expenses || {});
      setGoalData(data.goal || {});
      setMonthlySavings(data.monthlySavings || {});
    }
  };

  const handleExpenseUpdate = async (data) => {
    setExpenseData(data);
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "goalTracker", user.uid), {
        expenses: data,
        goal: goalData,
        monthlySavings: monthlySavings,
      }, { merge: true });
    }
  };

  const handleGoalUpdate = async (data) => {
    setGoalData(data);
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "goalTracker", user.uid), {
        expenses: expenseData,
        goal: data,
        monthlySavings: monthlySavings,
      }, { merge: true });
    }
  };

  const handleAddMonthlySaving = async (e) => {
    e.preventDefault();
    if (!newSaving.month || !newSaving.amount) {
      toast.error("Please enter both month and savings amount");
      return;
    }

    const amount = parseFloat(newSaving.amount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid savings amount");
      return;
    }

    const updatedSavings = {
      ...monthlySavings,
      [newSaving.month]: amount,
    };

    setMonthlySavings(updatedSavings);
    setNewSaving({ month: "", amount: "" });
    toast.success("Monthly savings recorded successfully!");

    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "goalTracker", user.uid), {
        expenses: expenseData,
        goal: goalData,
        monthlySavings: updatedSavings,
      }, { merge: true });
    }
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

    const recordMonthlySavings = async () => {
      const user = auth.currentUser;
      if (user) {
        const savingsDocRef = doc(db, "monthlySavings", user.uid);
        const savingsSnapshot = await getDoc(savingsDocRef);
        const savingsData = savingsSnapshot.exists() ? savingsSnapshot.data() : {};
        const month = new Date().toLocaleString('default', { month: 'long' });
        const year = new Date().getFullYear();

        savingsData[`${month}-${year}`] = {
          savings: currentSavings > 0 ? currentSavings : 0,
          timestamp: new Date(),
        };

        await setDoc(savingsDocRef, savingsData, { merge: true });
      }
    };

    recordMonthlySavings();
  }, [expenseData, monthlySavings]); // Added monthlySavings as dependency

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    navigate("/");
  };

  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const goalProgressData = Object.entries(monthlySavings)
    .map(([month, amount]) => {
      const [year, monthName] = month.split("-");
      return { month: `${monthName.substr(0, 3)} ${year}`, amount };
    })
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(" ");
      const [bMonth, bYear] = b.month.split(" ");
      return new Date(`${aYear}-${monthOrder.indexOf(aMonth) + 1}-01`) - new Date(`${bYear}-${monthOrder.indexOf(bMonth) + 1}-01`);
    });

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
            <NavigationMenuLink 
              className="px-4 py-2 hover:bg-gray-100 rounded-md" 
              onClick={() => navigate('/financial-advisor')}
            >
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
            <NavigationMenuLink 
              className="px-4 py-2 hover:bg-gray-100 rounded-md" 
              onClick={() => navigate('/scenario-planning')}
            >
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
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full h-[300px]">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Income vs Savings</h2>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={goalProgressData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#1E90FF" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-6">
            <ExpenseChart data={expenseData} />
            <AIInsights
              expenseData={expenseData}
              goalData={goalData}
              monthlySavings={monthlySavings}
              newSaving={newSaving}
              setNewSaving={setNewSaving}
              handleAddMonthlySaving={handleAddMonthlySaving}
            />
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-10 h-10 rounded-full cursor-pointer" 
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;