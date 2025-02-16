import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { AlertCircle, TrendingUp, Wallet } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ResultsDashboard = ({ results, onReset }) => {
  const { data, suggestions, risk, eventSuggestion } = results;

  const expenseData = [
    { name: 'Primary', value: data.primaryExpenses },
    { name: 'Entertainment', value: data.entertainment },
    { name: 'Travel', value: data.travel },
    { name: 'Lifestyle', value: data.lifestyle },
    { name: 'Medical', value: data.medical },
    { name: 'Other', value: data.otherExpenses },
  ];

  const savingsRate = ((data.income - data.totalExpenses) / data.income) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Monthly Overview</h3>
            <Wallet className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">Income: ${data.income.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Expenses: ${data.totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Savings Rate: {savingsRate.toFixed(1)}%</p>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Risk Assessment</h3>
            <AlertCircle className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">Risk Level: {risk}</p>
            <div className={`w-full h-2 rounded-full ${
              risk === "Low" ? "bg-green-500" :
              risk === "Medium" ? "bg-yellow-500" :
              "bg-red-500"
            }`} />
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Event Analysis</h3>
            <TrendingUp className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{eventSuggestion}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label
                    content={() => (
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-sm font-medium"
                      >
                        Expenses
                      </text>
                    )}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {expenseData.map((item, index) => (
              <div key={item.name} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <h3 className="text-lg font-semibold mb-4">Suggestions</h3>
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm text-gray-600 dark:text-gray-300 flex items-start"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0" />
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline">
          Start New Analysis
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultsDashboard;