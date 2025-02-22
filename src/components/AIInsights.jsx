import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Target, PlusCircle, ArrowRight } from "lucide-react";
import {
  analyzeSpendingPattern,
  generateInvestmentAdvice,
  calculateGoalFeasibility,
  calculateTotalSavings,
  calculateProgressPercentage
} from "../utils/financeUtils";
import { toast } from "sonner";

const AIInsights = ({ expenseData, goalData, monthlySavings, newSaving, setNewSaving, handleAddMonthlySaving }) => {
  const [insights, setInsights] = useState({
    progress: 0,
    targetAmount: 0,
    currentSavings: 0,
    monthlyTarget: 0,
    timeToGoal: 0,
    feasibility: null,
    spendingAnalysis: "",
    investmentAdvice: null,
  });

  const generateDetailedAnalysis = () => {
    const monthlyTarget = goalData.targetAmount / goalData.timeframe;
    const currentSavings = insights.currentSavings; // Revert back to using insights.currentSavings
    const difference = monthlyTarget - currentSavings;
    const projectedMonths = Math.ceil((goalData.targetAmount - insights.currentSavings) / currentSavings);

    return [
      {
        title: "Monthly Target",
        value: monthlyTarget.toFixed(2),
        highlight: false
      },
      {
        title: "Time to Goal",
        value: `${projectedMonths} months`,
        highlight: false
      },
      {
        title: "Monthly Savings",
        value: currentSavings.toFixed(2),
        highlight: currentSavings < monthlyTarget,
        color: currentSavings >= monthlyTarget ? "text-green-600" : "text-red-600"
      },
      {
        message: `Monthly Target: ${monthlyTarget.toFixed(2)} | Current Savings: ${currentSavings.toFixed(2)}`,
        icon: TrendingUp
      },
      {
        message: difference > 0 
          ? `You're ${difference.toFixed(2)} behind your monthly target. To reach your goal of ${goalData.targetAmount} in ${goalData.timeframe} months, consider reducing non-essential expenses.`
          : `You're on track with your monthly target! Keep up the good work!`,
        icon: AlertTriangle
      },
      {
        message: `At your current savings rate of ${currentSavings.toFixed(2)} per month: ${
          projectedMonths > goalData.timeframe 
            ? `You will reach your goal in ${projectedMonths} months (exceeding your target timeframe).`
            : `You will reach your goal in ${projectedMonths} months (within your target timeframe).`
        }`,
        icon: ArrowRight
      }
    ];
  };

  useEffect(() => {
    if (!expenseData.income || !goalData.targetAmount) return;

    const calculateInsights = () => {
      const totalExpenses = Object.values(expenseData.primaryExpenses).reduce(
        (sum, value) => sum + (parseFloat(value) || 0),
        0
      ) + Object.values(expenseData.secondaryExpenses).reduce(
        (sum, value) => sum + (parseFloat(value) || 0),
        0
      );
      
      const targetAmount = parseFloat(goalData.targetAmount);
      const timeframe = parseInt(goalData.timeframe) || 12;
      const monthlyTarget = targetAmount / timeframe;
      
      const totalSaved = calculateTotalSavings(monthlySavings); // Revert to using monthlySavings
      const progress = calculateProgressPercentage(totalSaved, targetAmount);

      const feasibility = calculateGoalFeasibility(
        expenseData.income,
        totalExpenses,
        targetAmount,
        timeframe
      );

      setInsights({
        progress,
        targetAmount,
        currentSavings: totalSaved, // Revert to using totalSaved
        monthlyTarget,
        timeToGoal: timeframe,
        feasibility,
        spendingAnalysis: analyzeSpendingPattern(expenseData),
        investmentAdvice: generateInvestmentAdvice(
          expenseData.income,
          totalExpenses,
          "Moderate"
        ),
      });
    };

    calculateInsights();
  }, [expenseData, goalData, monthlySavings]); // Keep monthlySavings in dependencies

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Goal Tracker</h2>
          <p className="text-sm text-gray-500">Smart recommendations based on your financial data</p>
        </div>
        <span className="text-sm text-blue-600 flex items-center gap-1">
          <AlertTriangle className="w-4 h-4" />
          Financial Advisor
        </span>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Record Monthly Savings
          </h3>
          <form onSubmit={handleAddMonthlySaving} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <input
                  type="month"
                  value={newSaving.month}
                  onChange={(e) => setNewSaving(prev => ({ ...prev, month: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Saved
                </label>
                <input
                  type="number"
                  value={newSaving.amount}
                  onChange={(e) => setNewSaving(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add Monthly Saving
            </button>
          </form>
        </div>

        {Object.keys(monthlySavings).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Recorded Savings</h3>
            <div className="space-y-2">
              {Object.entries(monthlySavings)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([month, amount]) => (
                  <div key={month} className="flex justify-between text-sm">
                    <span>{new Date(month).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                    <span className="font-medium">₹{amount.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Goal Progress</span>
            <span>Target: ₹{insights.targetAmount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Total Savings:</span>
            <span>₹{insights.currentSavings?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${insights.progress || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="space-y-4">
          {insights.feasibility && (
            <div className={`flex items-center gap-2 ${insights.feasibility.color}`}>
              {insights.feasibility.status === "On Track" ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span className="font-medium">{insights.feasibility.message}</span>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Spending Analysis</h3>
            <p className="text-sm text-gray-600">{insights.spendingAnalysis}</p>
          </div>

          {insights.investmentAdvice && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Investment Recommendations</h3>
              <p className="text-sm text-gray-600">{insights.investmentAdvice.suggestion}</p>
              <p className="text-sm text-blue-600 mt-1">
                Recommended: {insights.investmentAdvice.products}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {generateDetailedAnalysis().slice(0, 3).map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">{item.title}</div>
                <div className={`text-lg font-semibold ${item.color || 'text-gray-900'}`}>
                ₹{item.value}
                </div>
              </div>
            ))}
          </div>

          {generateDetailedAnalysis().slice(3).map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
              <item.icon className="w-5 h-5 mt-0.5 text-gray-600" />
              <p className="text-sm text-gray-600">{item.message}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Required Monthly Savings:</span>
            <span>₹{insights.monthlyTarget?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Time to Goal:</span>
            <span>{insights.timeToGoal || '--'} months</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
