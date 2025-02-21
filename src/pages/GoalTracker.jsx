import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, db, doc, getDoc, setDoc, signInWithGoogle, signOutUser } from "@/firebase"; // Import Firebase
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
import { Button } from "@/components/ui/button"; // Add this import
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Add this import

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
      } else {
        navigate("/"); // Redirect to home or login page if not signed in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch user expenses and goal data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "goalTracker", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setExpenseData(data.expenses || {});
          setGoalData(data.goal || {});
          setMonthlySavings(data.monthlySavings || {});
        }
      }
    };
    fetchData();
  }, []);

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

    // Record monthly savings in Firebase
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
  }, [expenseData]);

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    navigate("/"); // Redirect to home or login page after sign out
  };

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

      {/* User Info and Sign Out Button */}
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Index;
