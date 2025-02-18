export const calculateMonthlySavings = (income, expenses) => {
    const totalExpenses = Object.values(expenses).reduce(
      (sum, value) => sum + (parseFloat(value) || 0),
      0
    );
    return income - totalExpenses;
  };
  
  export const classifyExpense = (expenseName) => {
    const primaryExpenses = [
      "housing",
      "electricity",
      "water",
      "gas",
      "mobile",
      "insurance",
      "loans",
      "provident",
      "education",
      "medication",
      "groceries",
    ];
    const secondaryExpenses = ["lifestyle", "traveling", "entertainment", "misc"];
  
    if (primaryExpenses.includes(expenseName.toLowerCase())) return "Primary";
    if (secondaryExpenses.includes(expenseName.toLowerCase())) return "Secondary";
    return "Unknown";
  };
  
  export const suggestInvestment = (savings, riskLevel) => {
    if (riskLevel === "Low") return "Fixed Deposits, Bonds";
    if (riskLevel === "Moderate") return "SIPs, Mutual Funds";
    if (riskLevel === "High") return "Stocks, Crypto, Startups";
    return "Savings Account";
  };
  
  export const adjustBudget = (income, expenses, savingsGoal, months) => {
    const monthlySavings = savingsGoal / months;
    const requiredCut = monthlySavings - (income - expenses);
  
    if (requiredCut > 0) {
      return `Reduce expenses by ${requiredCut.toFixed(2)} per month to reach your goal!`;
    }
    return "Your budget is on track!";
  };
  
  export const analyzeSpendingPattern = (expenses) => {
    const primaryTotal = Object.values(expenses.primaryExpenses).reduce(
      (sum, value) => sum + (parseFloat(value) || 0),
      0
    );
    const secondaryTotal = Object.values(expenses.secondaryExpenses).reduce(
      (sum, value) => sum + (parseFloat(value) || 0),
      0
    );
  
    const spendingScore = (secondaryTotal / primaryTotal) * 100;
    
    if (spendingScore > 50) return "High discretionary spending";
    if (spendingScore > 30) return "Moderate discretionary spending";
    return "Conservative spending pattern";
  };
  
  export const generateInvestmentAdvice = (monthlyIncome, expenses, riskProfile = "Moderate") => {
    const disposableIncome = monthlyIncome - expenses;
    const investmentPercentage = disposableIncome / monthlyIncome * 100;
  
    if (investmentPercentage < 10) {
      return {
        suggestion: "Consider starting with low-risk investments",
        products: suggestInvestment(disposableIncome, "Low"),
      };
    } else if (investmentPercentage < 30) {
      return {
        suggestion: "You can diversify your investment portfolio",
        products: suggestInvestment(disposableIncome, riskProfile),
      };
    } else {
      return {
        suggestion: "You have good investment capacity",
        products: suggestInvestment(disposableIncome, "High"),
      };
    }
  };
  
  export const calculateGoalFeasibility = (income, expenses, goalAmount, months) => {
    const monthlySavingsNeeded = goalAmount / months;
    const currentSavingCapacity = income - expenses;
    
    const feasibilityScore = (currentSavingCapacity / monthlySavingsNeeded) * 100;
    
    if (feasibilityScore >= 100) {
      return {
        status: "On Track",
        message: "You're on track to reach your goal!",
        color: "text-green-600",
      };
    } else if (feasibilityScore >= 75) {
      return {
        status: "Near Goal",
        message: "You're close! Small adjustments needed.",
        color: "text-yellow-600",
      };
    } else {
      return {
        status: "Needs Attention",
        message: `Increase monthly savings by $${(monthlySavingsNeeded - currentSavingCapacity).toFixed(2)} to reach your goal`,
        color: "text-red-600",
      };
    }
  };
  
  export const calculateTotalSavings = (monthlySavings) => {
    return Object.values(monthlySavings).reduce((total, saving) => total + saving, 0);
  };
  
  export const calculateProgressPercentage = (totalSavings, targetAmount) => {
    return Math.min(100, (totalSavings / targetAmount) * 100);
  };