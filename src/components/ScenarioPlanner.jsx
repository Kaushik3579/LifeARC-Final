import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { CreateScenario } from "./CreateScenario";
import { ScenarioResults } from "./ScenarioResults";
import { useToast } from "../hooks/use-toast";

export const ScenarioPlanner = () => {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [baseExpenses, setBaseExpenses] = useState({});
  const [savingsGoal, setSavingsGoal] = useState("");
  const [scenarios, setScenarios] = useState([]);
  const [showCreateScenario, setShowCreateScenario] = useState(false);
  const { toast } = useToast();

  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const handleAddExpense = () => {
    if (newExpenseCategory && newExpenseAmount) {
      setBaseExpenses({
        ...baseExpenses,
        [newExpenseCategory]: parseFloat(newExpenseAmount)
      });
      setNewExpenseCategory("");
      setNewExpenseAmount("");
    }
  };

  const evaluateBudget = () => {
    const totalExpenses = Object.values(baseExpenses).reduce((sum, amount) => sum + amount, 0);
    const savings = parseFloat(monthlyIncome) - totalExpenses;
    const savingsDeficit = Math.max(0, parseFloat(savingsGoal) - savings);

    let message = `Monthly Income: ₹${parseFloat(monthlyIncome).toFixed(2)}\n`;
    message += `Total Expenses: ₹${totalExpenses.toFixed(2)}\n`;
    message += `Savings: ₹${savings.toFixed(2)}\n`;
    message += `Savings Goal: ₹${parseFloat(savingsGoal).toFixed(2)}\n`;
    message += `Savings Deficit: ₹${savingsDeficit.toFixed(2)}`;

    toast({
      title: "Budget Evaluation",
      description: savingsDeficit > 0 
        ? "⚠ Warning: You are not meeting your savings goal. Consider reducing expenses or increasing income."
        : "✅ You are meeting your savings goal. Great job!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!monthlyIncome || !savingsGoal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    evaluateBudget();
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                  </span>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="savingsGoal">Monthly Savings Goal</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                  </span>
                  <Input
                    id="savingsGoal"
                    type="number"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(e.target.value)}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Monthly Expenses</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expenseCategory">Expense Category</Label>
                  <Input
                    id="expenseCategory"
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                    placeholder="e.g., Rent"
                  />
                </div>
                <div>
                  <Label htmlFor="expenseAmount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                    </span>
                    <Input
                      id="expenseAmount"
                      type="number"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddExpense}
                    className="w-full"
                    disabled={!newExpenseCategory || !newExpenseAmount}
                  >
                    Add Expense
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(baseExpenses).map(([category, amount], index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <span className="font-medium">{category}</span>
                    <span>₹{amount.toFixed(2)}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button type="submit" className="w-full md:w-auto">
                Evaluate Budget
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto mt-4 md:mt-0"
                onClick={() => setShowCreateScenario(true)}
              >
                Create Scenario
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showCreateScenario && (
          <CreateScenario
            monthlyIncome={parseFloat(monthlyIncome) || 0}
            baseExpenses={baseExpenses}
            savingsGoal={parseFloat(savingsGoal) || 0}
            scenarios={scenarios}
            setScenarios={setScenarios}
            onClose={() => setShowCreateScenario(false)}
          />
        )}
      </AnimatePresence>

      {Object.keys(scenarios).length > 0 && (
        <ScenarioResults 
          scenarios={scenarios} 
          monthlyIncome={parseFloat(monthlyIncome) || 0} 
          totalExpenses={Object.values(baseExpenses).reduce((sum, amount) => sum + amount, 0)} 
        />
      )}
    </div>
  );
};
