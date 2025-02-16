import { motion } from "framer-motion";
import { useState } from "react";
import FinancialForm from "./FinancialForm";
import ResultsDashboard from "../components/ResultsDashboard";
import { cn } from "@/lib/utils";

const FinancialAdvisor = () => {
  const [results, setResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate ML model processing
      const suggestions = analyzeExpenses(data);
      const stabilityAdvice = getFinancialStabilityAdvice(data);
      const risk = assessEventRisk(data);
      
      setResults({
        suggestions: [...suggestions, ...stabilityAdvice],
        risk,
        eventSuggestion: EVENT_SUGGESTIONS[data.event] || "No specific recommendation for this event.",
        data
      });
    } catch (error) {
      console.error("Error processing data:", error);
    }
    setIsSubmitting(false);
  };

  const handleFinancialAdvisioClick = () => {
    document.getElementById('financial-form-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <header className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Financial Advisory System
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Make informed decisions about your financial future
          </motion.p>
        </header>

        <div className="dashboard mb-8">
          <section className="section-b bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 relative overflow-hidden cursor-pointer" onClick={handleFinancialAdvisioClick}>
            <center><h2 className="text-xl font-bold text-primary/20">Financial Advisior</h2>
            </center></section>
        </div>

        <div id="financial-form-section" className={cn(
          "max-w-4xl mx-auto bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6",
          "transition-all duration-500 ease-in-out",
          results ? "scale-90 opacity-0 h-0 overflow-hidden" : "scale-100 opacity-100"
        )}>
          <FinancialForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
        </div>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6"
          >
            <ResultsDashboard results={results} onReset={() => setResults(null)} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// ML Model Constants and Functions
const EVENT_SUGGESTIONS = {
  child_education: "Consider starting an education fund or investing in long-term savings plans.",
  child_marriage: "Plan early with investments in gold, fixed deposits, or mutual funds.",
  buying_car: "Check loan options and balance EMIs within 15-20% of your monthly income.",
  medical_emergency: "Ensure you have sufficient health insurance and an emergency fund.",
  home_renovation: "Consider cost-effective renovation plans and assess mortgage or personal loan options.",
  job_loss: "Create an emergency fund covering at least 6 months of expenses and reduce discretionary spending.",
  vacation_planning: "Save in advance using recurring deposits or travel funds to avoid financial strain.",
  retirement_planning: "Increase investments in pension plans, long-term funds, and diversify for secure post-retirement life.",
  starting_a_business: "Assess startup costs, secure funding sources, and manage financial risks wisely.",
  buying_a_house: "Check mortgage options, calculate EMI affordability, and plan down payments accordingly."
};

const getFinancialStabilityAdvice = (data) => {
  const stabilityAdvice = [];
  const savingsRate = ((data.income - data.totalExpenses) / data.income) * 100;
  
  // 1. Increase Savings
  stabilityAdvice.push(`💹 Increase Savings: ${
    savingsRate < 20 
      ? "Set up automatic savings transfers and aim for 20% of income. Current savings rate: " + savingsRate.toFixed(1) + "%"
      : "Great job maintaining savings! Consider increasing investments for better returns."
  }`);

  // 2. Reduce Expenses
  stabilityAdvice.push(`📉 Reduce Expenses: ${
    data.totalExpenses > 0.7 * data.income
      ? "Review subscriptions, utilities, and daily expenses. Target reducing monthly expenses by 15-20%."
      : "Your expense management is good. Keep monitoring for optimization opportunities."
  }`);

  // 3. Invest in Stable Assets
  stabilityAdvice.push(`📈 Investment Strategy: ${
    data.inflationRate > 5
      ? "Consider diversifying into inflation-protected securities, bonds, and stable dividend stocks."
      : "Look into index funds, government bonds, and high-yield savings accounts."
  }`);

  // 4. Get Insurance
  stabilityAdvice.push(`🛡️ Insurance Planning: ${
    data.medical === 0
      ? "Priority: Get health insurance coverage. Consider life and disability insurance based on dependents."
      : "Review current insurance coverage annually. Consider umbrella policy for additional protection."
  }`);

  // 5. Build Emergency Fund
  const monthsOfExpenses = (data.income - data.totalExpenses) / data.totalExpenses;
  stabilityAdvice.push(`🏦 Emergency Fund: ${
    monthsOfExpenses < 6
      ? "Build emergency fund to cover 6 months of expenses. Current buffer: " + monthsOfExpenses.toFixed(1) + " months."
      : "Well done maintaining emergency fund! Consider investing excess beyond 6 months of expenses."
  }`);

  return stabilityAdvice;
};

const analyzeExpenses = (data) => {
  const suggestions = [];
  
  if (data.totalExpenses > data.income) {
    suggestions.push("⚠️ Your total expenses exceed your income. Consider reducing discretionary spending.");
  }
  
  if (data.entertainment > 0.1 * data.income) {
    suggestions.push("🎭 Consider reducing entertainment expenses with free or low-cost activities.");
  }
  
  if (data.travel > 0.1 * data.income) {
    suggestions.push("✈️ Consider budget-friendly travel alternatives.");
  }
  
  if (data.lifestyle > 0.15 * data.income) {
    suggestions.push("🛍️ Consider reducing lifestyle expenses and avoiding impulse purchases.");
  }
  
  if (data.medical === 0) {
    suggestions.push("🏥 Consider health insurance for medical emergencies.");
  }
  
  if (data.inflationRate > 5) {
    suggestions.push("📈 Consider investing in assets that grow over time to protect your savings.");
  }

  if (data.income - data.totalExpenses < 0.2 * data.income) {
    suggestions.push("🚨 Your savings buffer is low. Consider increasing your emergency fund.");
  }

  if (data.inflationRate > 6) {
    suggestions.push("📉 High inflation risk detected. Diversify investments into inflation-protected assets.");
  }

  const savingsRate = ((data.income - data.totalExpenses) / data.income) * 100;
  if (savingsRate < 20) {
    suggestions.push("💰 Your savings rate is below recommended levels. Aim to save at least 20% of your income.");
  }

  const primaryExpenseRatio = (data.primaryExpenses / data.income) * 100;
  if (primaryExpenseRatio > 50) {
    suggestions.push("📊 Your primary expenses are high relative to income. Consider ways to reduce fixed costs.");
  }

  const discretionaryExpenses = data.entertainment + data.travel + data.lifestyle;
  if (discretionaryExpenses > 0.3 * data.income) {
    suggestions.push("💫 Your discretionary spending is high. Consider the 50/30/20 budgeting rule.");
  }

  return suggestions;
};

const assessEventRisk = (data) => {
  const savingsBuffer = ((data.income - data.totalExpenses) / data.income) * 100;
  const inflationImpact = data.inflationRate > 6;
  
  let riskLevel = savingsBuffer > 20 ? "Low" : savingsBuffer >= 10 ? "Medium" : "High";
  
  if (inflationImpact && riskLevel !== "High") {
    riskLevel = riskLevel === "Low" ? "Medium" : "High";
  }
  
  if (["child_education", "child_marriage", "buying_a_house", "retirement_planning"].includes(data.event)) {
    riskLevel = riskLevel === "Low" ? "Medium" : "High";
  }
  
  return riskLevel;
};

export default FinancialAdvisor;
