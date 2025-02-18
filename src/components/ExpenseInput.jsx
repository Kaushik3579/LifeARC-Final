import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

export const ExpenseInput = ({ expenses, setExpenses }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleAddExpense = () => {
    if (category && amount) {
      setExpenses([...expenses, { category, amount: parseFloat(amount) }]);
      setCategory("");
      setAmount("");
    }
  };

  const handleRemoveExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="category">Expense Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Rent"
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
            disabled={!category || !amount}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {expenses.map((expense, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
            >
              <span className="font-medium">{expense.category}</span>
              <div className="flex items-center space-x-4">
                <span>${expense.amount.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveExpense(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
