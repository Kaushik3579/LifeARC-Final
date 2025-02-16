import { useState, useEffect } from "react";
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

const MonthlyExpenseTracker = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [expenseDetails, setExpenseDetails] = useState([]); // Stores ALL expenses
  const [formData, setFormData] = useState({ why: "", amount: "" });

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenseDetails");
    if (savedExpenses) {
      setExpenseDetails(JSON.parse(savedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenseDetails", JSON.stringify(expenseDetails));
  }, [expenseDetails]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const expenseOptions = [
    "Housing", "Electricity", "Water", "Gas", "Mobile", "Insurance", "Loans", "Provident Fund", "Education", "Medication", "Groceries",
    "Travel", "Entertainment", "Medical", "Luxury", "Bonds", "Stocks", "Shares", "Fixed Deposits", "Real Estate", "Mutual Funds", "Cryptocurrency", "Gold"
  ];

  const handleAddExpense = () => {
    if (formData.why && formData.amount && selectedMonth && selectedYear) {
      const newExpense = {
        ...formData,
        amount: parseFloat(formData.amount),
        month: selectedMonth,
        year: selectedYear,
        date: new Date().toISOString(), // Add a timestamp for unique identification
      };
      setExpenseDetails((prevDetails) => [...prevDetails, newExpense]); // Add new expense to the list
      setFormData({ why: "", amount: "" }); // Reset form fields
    } else {
      alert("Please fill in all fields and select a month and year.");
    }
  };

  // Filter expenses for the selected month and year
  const filteredExpenses = expenseDetails.filter(
    (expense) => expense.month === selectedMonth && expense.year === selectedYear
  );

  // Format data for the bar chart
  const expenseData = filteredExpenses.map((expense) => ({
    name: expense.why,
    amount: expense.amount,
  }));

  const handleLogout = () => {
    localStorage.removeItem("expenseDetails");
    setExpenseDetails([]); // Clear all expense data on logout
    navigate("/"); // Navigate to the home page or login page
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/5 rounded-xl">
            <ChartBar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Monthly Expense Tracker</h1>
            <p className="text-sm text-gray-500">Track your expenses over time</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute top-4 right-20">
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
            Logout
          </Button>
        </div>

        {/* Month and Year Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Select onValueChange={setSelectedMonth}>
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

          <Select onValueChange={setSelectedYear}>
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

        {/* Expense Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Select onValueChange={(value) => setFormData({ ...formData, why: value })}>
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
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="bg-white text-black"
          />
        </div>

        {/* Add Expense Button */}
        <Button onClick={handleAddExpense} className="mb-8 bg-black text-white">
          Add Expense
        </Button>

        {/* Graph */}
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

        {/* Expense Table */}
        {filteredExpenses.length > 0 && (
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Why</th>
                  <th className="px-4 py-2">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense, index) => (
                  <tr key={index}>
                    <td className="border-t px-4 py-2">{index + 1}</td>
                    <td className="border-t px-4 py-2">{expense.why}</td>
                    <td className="border-t px-4 py-2">{expense.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyExpenseTracker;