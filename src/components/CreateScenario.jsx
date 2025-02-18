import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "framer-motion";
import { useToast } from "../hooks/use-toast";
import { X } from "lucide-react";

export const CreateScenario = ({ 
  monthlyIncome, 
  baseExpenses, 
  savingsGoal, 
  scenarios, 
  setScenarios, 
  onClose 
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

    const requiredMonthlySavings = parseFloat(eventCost) / parseFloat(monthsToSave);
    const totalExpenses = Object.values(baseExpenses).reduce((sum, amount) => sum + amount, 0);
    const currentSavings = monthlyIncome - totalExpenses;
    const adjustedSavingsGoal = savingsGoal + requiredMonthlySavings;

    let scenarioResult;
    if (currentSavings >= requiredMonthlySavings) {
      scenarioResult = {
        eventCost: parseFloat(eventCost),
        monthsToSave: parseInt(monthsToSave),
        requiredMonthlySavings,
        adjustedSavingsGoal,
        savings: currentSavings,
        savingsDeficit: Math.max(0, adjustedSavingsGoal - currentSavings),
        recommendation: `✅ You can afford this event by saving an additional $${requiredMonthlySavings.toFixed(2)} per month.`
      };
    } else {
      const savingsDeficit = requiredMonthlySavings - currentSavings;
      scenarioResult = {
        eventCost: parseFloat(eventCost),
        monthsToSave: parseInt(monthsToSave),
        requiredMonthlySavings,
        adjustedSavingsGoal,
        savings: currentSavings,
        savingsDeficit,
        recommendation: `⚠ You cannot afford this event with your current budget. You need to save an additional $${savingsDeficit.toFixed(2)} per month. Consider reducing expenses or increasing income.`
      };
    }

    setScenarios({
      ...scenarios,
      [name]: scenarioResult
    });

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
      className="fixed inset-0 bg-white z-50 flex items-center justify-center" // Updated background style to solid white
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
              placeholder="e.g., New Project"
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
