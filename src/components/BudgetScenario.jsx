import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "framer-motion";
import { useToast } from "../hooks/use-toast";
import { X } from "lucide-react";

export const BudgetScenario = ({
  monthlyIncome,
  expenses,
  savingsGoal,
  scenarios,
  setScenarios,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [eventCost, setEventCost] = useState("");
  const [monthsToSave, setMonthsToSave] = useState("");
  const { toast } = useToast();

  const simulateScenario = () => {
    if (!name || !eventCost || !monthsToSave) {
      toast({
        title: "Missing Information",
        description: "Please fill in all scenario details",
        variant: "destructive",
      });
      return;
    }

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const currentSavings = monthlyIncome - totalExpenses;
    const requiredMonthlySavings = parseFloat(eventCost) / parseFloat(monthsToSave);
    const adjustedSavingsGoal = savingsGoal + requiredMonthlySavings;
    const canAfford = currentSavings >= requiredMonthlySavings;

    const scenario = {
      name,
      eventCost: parseFloat(eventCost),
      monthsToSave: parseInt(monthsToSave),
      requiredMonthlySavings,
      adjustedSavingsGoal,
      currentSavings,
      canAfford,
      savingsDeficit: canAfford ? 0 : requiredMonthlySavings - currentSavings,
    };

    setScenarios([...scenarios, scenario]);
    toast({
      title: "Scenario Created",
      description: `The scenario "${name}" has been created successfully`,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <Card className="w-full max-w-lg p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-semibold mb-6">Create New Scenario</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="scenarioName">Scenario Name</Label>
            <Input
              id="scenarioName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Vacation Fund"
            />
          </div>
          <div>
            <Label htmlFor="eventCost">Total Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="eventCost"
                type="number"
                value={eventCost}
                onChange={(e) => setEventCost(e.target.value)}
                placeholder="0.00"
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="monthsToSave">Months to Save</Label>
            <Input
              id="monthsToSave"
              type="number"
              value={monthsToSave}
              onChange={(e) => setMonthsToSave(e.target.value)}
              placeholder="12"
            />
          </div>
          <Button onClick={simulateScenario} className="w-full">
            Simulate Scenario
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
