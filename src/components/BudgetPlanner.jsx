import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { BudgetScenario } from "./BudgetScenario";
import { ExpenseInput } from "./ExpenseInput";
import { BudgetSummary } from "./BudgetSummary";
import { ScenarioResults } from "./ScenarioResults";
import { useToast } from "../hooks/use-toast";

export const BudgetPlanner = () => {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [scenarios, setScenarios] = useState([]); // Ensure scenarios is initialized as an array
  const [showScenario, setShowScenario] = useState(false);
  const { toast } = useToast();

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

    toast({
      title: "Budget Updated",
      description: "Your budget has been successfully updated",
    });
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
                    $
                  </span>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="savingsGoal">Monthly Savings Goal</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="savingsGoal"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <ExpenseInput expenses={expenses} setExpenses={setExpenses} />

            <div className="flex justify-between items-center pt-4">
              <Button type="submit" className="w-full md:w-auto">
                Update Budget
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto mt-4 md:mt-0"
                onClick={() => setShowScenario(true)}
              >
                Create Scenario
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showScenario && (
          <BudgetScenario
            monthlyIncome={parseFloat(monthlyIncome) || 0}
            expenses={expenses}
            savingsGoal={parseFloat(savingsGoal) || 0}
            scenarios={scenarios}
            setScenarios={setScenarios}
            onClose={() => setShowScenario(false)}
          />
        )}
      </AnimatePresence>

      {scenarios.length > 0 && (
        <>
          <BudgetSummary
            monthlyIncome={parseFloat(monthlyIncome)}
            expenses={expenses}
            savingsGoal={parseFloat(savingsGoal)}
            scenarios={scenarios}
          />
          <ScenarioResults scenarios={scenarios} />
        </>
      )}
    </div>
  );
};
