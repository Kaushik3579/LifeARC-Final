import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Expenses from "@/pages/Expenses";
import SecondaryExpenses from "@/pages/SecondaryExpenses";
import MonthlyExpenseTracker from "@/pages/MonthlyExpenseTracker";
import NotFound from "@/pages/NotFound";
import FinancialAdvisor from "@/pages/financial-advisor.jsx";
import FinancialForm from "@/pages/FinancialForm";
import GoalTracker from "@/pages/GoalTracker";
import ScenarioPlanning from "@/pages/scenarioPlanning"; // Add this import
import TaxEstimator from './pages/taxEstimator';
import Profile from './pages/Profile'; // Add this import
import ErrorBoundary from './components/ErrorBoundary'; // Add this import
import "@/styles/responsive.css";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/secondary-expenses" element={<SecondaryExpenses />} />
              <Route path="/monthly-tracker" element={<MonthlyExpenseTracker />} />
              <Route path="/financial-advisor" element={<FinancialAdvisor />} />
              <Route path="/financial-form" element={<FinancialForm />} />
              <Route path="/goal-tracker" element={<GoalTracker />} />
              <Route path="/scenario-planning" element={<ScenarioPlanning style={{ background: 'solid' }} />} /> {/* Update the ScenarioPlanning route */}
              <Route path="/taxEstimator" element={<TaxEstimator />} />
              <Route path="/profile" element={<Profile />} /> {/* Add the Profile route */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
