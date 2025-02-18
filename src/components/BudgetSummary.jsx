import { Card } from "./ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

export const BudgetSummary = ({
  monthlyIncome,
  expenses,
  savingsGoal,
  scenarios,
}) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const currentSavings = monthlyIncome - totalExpenses;

  const pieData = [
    { name: "Savings", value: currentSavings },
    { name: "Expenses", value: totalExpenses },
  ];

  const scenarioData = scenarios.map((scenario) => ({
    name: scenario.name,
    required: scenario.requiredMonthlySavings,
    current: currentSavings,
    deficit: scenario.savingsDeficit,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Budget Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Monthly Income:</span>
            <span className="text-sm">${monthlyIncome.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Total Expenses:</span>
            <span className="text-sm">${totalExpenses.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Current Savings:</span>
            <span className="text-sm">${currentSavings.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Scenario Comparison</h3>
        <div className="h-64" style={{ height: 256 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="required"
                fill={COLORS[1]}
                name="Required Savings"
                barSize={100} // Increase bar size
              />
              <Bar
                dataKey="current"
                fill={COLORS[0]}
                name="Current Savings"
                barSize={100} // Increase bar size
              />
              <Bar
                dataKey="deficit"
                fill={COLORS[2]}
                name="Savings Deficit"
                barSize={100} // Increase bar size
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {scenarios.map((scenario, index) => (
            <div key={index} className="p-3 bg-secondary rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{scenario.name}</span>
                <span
                  className={`text-sm ${
                    scenario.canAfford ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {scenario.canAfford ? "Achievable" : "Needs Adjustment"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Saving ${scenario.requiredMonthlySavings.toFixed(2)} monthly
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
