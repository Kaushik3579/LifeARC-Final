import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Expenses from "@/pages/Expenses";
import SecondaryExpenses from "@/pages/SecondaryExpenses";
import Dashboard from "@/pages/Dashboard";
import MonthlyExpenseTracker from "@/pages/MonthlyExpenseTracker";
import NotFound from "@/pages/NotFound";
import FinancialAdvisor from "@/pages/financial-advisor";
import FinancialForm from "@/pages/FinancialForm";
import GoalTracker from "@/pages/GoalTracker"; // Import the GoalTracker page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/secondary-expenses" element={<SecondaryExpenses />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monthly-tracker" element={<MonthlyExpenseTracker />} />
          <Route path="/financial-advisor" element={<FinancialAdvisor />} />
          <Route path="/financial-form" element={<FinancialForm />} />
          <Route path="/goal-tracker" element={<GoalTracker />} /> {/* Add the GoalTracker route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
