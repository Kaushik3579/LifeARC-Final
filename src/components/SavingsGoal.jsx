
import { useState } from "react";
import { toast } from "sonner";

const SavingsGoal = ({ onUpdate }) => {
  const [goalData, setGoalData] = useState({
    targetAmount: "",
    timeframe: "12",
    currentSavings: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      targetAmount: parseFloat(goalData.targetAmount) || 0,
      timeframe: parseInt(goalData.timeframe) || 12,
      currentSavings: parseFloat(goalData.currentSavings) || 0,
    };
    onUpdate(processedData);
    toast.success("Savings goal updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Savings Goal</h2>
        <p className="text-sm text-gray-500">Set your target savings amount and timeframe</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Amount
          </label>
          <input
            type="number"
            value={goalData.targetAmount}
            onChange={(e) =>
              setGoalData((prev) => ({ ...prev, targetAmount: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter target amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeframe (months)
          </label>
          <input
            type="number"
            value={goalData.timeframe}
            onChange={(e) =>
              setGoalData((prev) => ({ ...prev, timeframe: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter number of months"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Set Goal
        </button>
      </div>
    </form>
  );
};

export default SavingsGoal;
