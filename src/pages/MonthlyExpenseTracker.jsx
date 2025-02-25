import { useState, useEffect, useCallback } from "react";
import { ChartBar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase";

const MonthlyExpenseTracker = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [expenseDetails, setExpenseDetails] = useState([]);
  const [formData, setFormData] = useState({ why: "", amount: "" });
  const [editingExpense, setEditingExpense] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [monthsToCompare, setMonthsToCompare] = useState(1);
  const [comparisonData, setComparisonData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Real-time listener for Firebase data
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/"); // Redirect to login if not authenticated
      return;
    }

    setLoading(true);
    const docRef = doc(db, "monthlyExpenses", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data().expenses || [];
        setExpenseDetails(data);
      } else {
        // Initialize document if it doesn't exist
        setDoc(docRef, { expenses: [] }, { merge: true });
        setExpenseDetails([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching expenses:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const saveExpensesToFirebase = useCallback(async (updatedExpenses) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, "monthlyExpenses", user.uid);
      await setDoc(docRef, { 
        expenses: updatedExpenses,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving expenses:", error);
      setValidationError("Failed to save expenses");
    }
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const expenseOptions = [
    "Housing", "Electricity", "Water", "Gas", "Mobile", "Insurance", "Loans",
    "Provident Fund", "Education", "Medication", "Groceries", "Travel",
    "Entertainment", "Medical", "Luxury", "Bonds", "Stocks", "Shares",
    "Fixed Deposits", "Real Estate", "Mutual Funds", "Cryptocurrency", "Gold"
  ];

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    resetForm();
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ why: "", amount: "" });
    setEditingExpense(null);
    setValidationError("");
  };

  const handleAddExpense = async () => {
    if (!formData.why || !formData.amount || !selectedMonth || !selectedYear) {
      setValidationError("All fields are required");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setValidationError("Please enter a valid amount");
      return;
    }

    setValidationError("");
    let updatedExpenses;

    if (editingExpense) {
      updatedExpenses = expenseDetails.map(expense =>
        expense.date === editingExpense.date
          ? {
              ...expense,
              why: formData.why,
              amount: amount,
              month: selectedMonth,
              year: selectedYear
            }
          : expense
      );
    } else {
      const newExpense = {
        why: formData.why,
        amount: amount,
        month: selectedMonth,
        year: selectedYear,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      updatedExpenses = [...expenseDetails, newExpense];
    }

    setExpenseDetails(updatedExpenses);
    await saveExpensesToFirebase(updatedExpenses);
    resetForm();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      why: expense.why,
      amount: expense.amount.toString()
    });
    setSelectedMonth(expense.month);
    setSelectedYear(expense.year);
  };

  const handleDelete = async (expenseToDelete) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const updatedExpenses = expenseDetails.filter(
        expense => expense.date !== expenseToDelete.date
      );
      setExpenseDetails(updatedExpenses);
      await saveExpensesToFirebase(updatedExpenses);
    }
  };

  const filteredExpenses = expenseDetails.filter(
    (expense) => expense.month === selectedMonth && expense.year === selectedYear
  );

  const expenseData = filteredExpenses.map((expense) => ({
    name: expense.why,
    amount: expense.amount,
  }));

  const handleLogout = () => {
    auth.signOut().then(() => navigate("/"));
  };

  const generateComparisonData = (numMonths) => {
    const currentDate = new Date();
    const months = [];
    let totalsByMonth = [];

    for (let i = 0; i < numMonths; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'long' });
      const year = monthDate.getFullYear();
      months.unshift({ month: monthName, year: year.toString() });
    }

    totalsByMonth = months.map(({ month, year }) => {
      const monthlyExpenses = expenseDetails.filter(
        expense => expense.month === month && expense.year === year
      );
      const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        month: `${month.substr(0, 3)} ${year}`,
        total: total
      };
    });

    setComparisonData(totalsByMonth);
  };

  const handleCompareMonths = (value) => {
    const numMonths = parseInt(value);
    setMonthsToCompare(numMonths);
    generateComparisonData(numMonths);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/5 rounded-xl">
            <ChartBar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Monthly Expense Tracker</h1>
            <p className="text-sm text-gray-500">Track your expenses over time</p>
          </div>
        </div>

        <div className="absolute top-4 right-20">
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
            Logout
          </Button>
        </div>

        <div className="absolute top-4 right-40">
          <Button onClick={() => navigate("/goal-tracker")}>Dashboard</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Select onValueChange={handleMonthChange} value={selectedMonth}>
            <SelectTrigger className="w-full bg-white text-black">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleYearChange} value={selectedYear}>
            <SelectTrigger className="w-full bg-white text-black">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Select onValueChange={(value) => setFormData({ ...formData, why: value })} value={formData.why}>
            <SelectTrigger className="w-full bg-white text-black">
              <SelectValue placeholder="Why is the expense?" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {expenseOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FloatingLabelInput
            label="How much is the expense? (₹)"
            type="number"
            value={formData.amount}
            onChange={handleChange("amount")}
            className="bg-white text-black"
          />
        </div>

        {validationError && (
          <p className="text-red-500 mb-4">{validationError}</p>
        )}

        <div className="mb-8">
          <Button 
            onClick={handleAddExpense} 
            className={`bg-black text-white ${(!formData.why || !formData.amount || !selectedMonth || !selectedYear) ? 'opacity-50' : ''}`}
            disabled={!formData.why || !formData.amount || !selectedMonth || !selectedYear}
          >
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </Button>
          
          {editingExpense && (
            <Button 
              onClick={resetForm} 
              className="ml-4 bg-gray-500 text-white"
            >
              Cancel Edit
            </Button>
          )}
        </div>

        {filteredExpenses.length > 0 && (
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full h-[500px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {filteredExpenses.length > 0 && (
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Why</th>
                  <th className="px-4 py-2">Amount (₹)</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense, index) => (
                  <tr key={expense.date}>
                    <td className="border-t px-4 py-2">{index + 1}</td>
                    <td className="border-t px-4 py-2">{expense.why}</td>
                    <td className="border-t px-4 py-2">{expense.amount}</td>
                    <td className="border-t px-4 py-2">
                      <Button
                        onClick={() => handleEdit(expense)}
                        className="mr-2 bg-blue-500 text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(expense)}
                        className="bg-red-500 text-white"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
              onClick={() => setIsDialogOpen(true)}
            >
              Compare Months
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="sm:max-w-[600px] bg-white border-none shadow-xl"
          >
            <DialogHeader>
              <DialogTitle className="text-gray-900">Compare Monthly Expenses</DialogTitle>
            </DialogHeader>
            <div className="py-4 bg-white">
              <Select 
                onValueChange={handleCompareMonths} 
                defaultValue="1"
              >
                <SelectTrigger className="w-full bg-white border border-gray-200">
                  <SelectValue placeholder="Select number of months to compare" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      Last {num} {num === 1 ? 'month' : 'months'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {comparisonData.length > 0 && (
                <div className="mt-4 h-[300px] bg-white p-2 rounded-lg">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        name="Total Expenses"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MonthlyExpenseTracker;