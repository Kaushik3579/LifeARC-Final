
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const ExpenseChart = ({ data }) => {
  const calculateTotalExpenses = (expenses) =>
    Object.values(expenses).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

  const totalPrimary = calculateTotalExpenses(data.primaryExpenses);
  const totalSecondary = calculateTotalExpenses(data.secondaryExpenses);
  const investments = parseFloat(data.investments) || 0;
  const income = parseFloat(data.income) || 0;
  const savings = income - totalPrimary - totalSecondary - investments;

  const chartData = [
    { name: "Primary Expenses", value: totalPrimary },
    { name: "Secondary Expenses", value: totalSecondary },
    { name: "Investments", value: investments },
    { name: "Savings", value: savings > 0 ? savings : 0 },
  ].filter((item) => item.value > 0);

  const COLORS = ["#f87171", "#fbbf24", "#60a5fa", "#4ade80"];

  return (
    <div className="glass-card rounded-xl p-6 animate-in">
      <h2 className="text-2xl font-semibold mb-6">Expense Breakdown</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
