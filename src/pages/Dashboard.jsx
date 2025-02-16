import { LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/5 rounded-xl">
            <LayoutGrid className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your expenses</p>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* Monthly Expense Tracker */}
          <div
            className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 relative overflow-hidden cursor-pointer"
            onClick={() => navigate("/monthly-tracker")}
          >
            <div className="absolute top-4 left-4 text-xl font-bold text-primary/20">Monthly Expense Tracker</div>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <img src="/path/to/logo.png" alt="Logo" className="w-16 h-16 mb-4" />
              <span className="text-gray-500">Track your monthly expenses</span>
            </div>
          </div>

          {/* Financial Advisor */}
          <div
            className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 relative overflow-hidden cursor-pointer"
            onClick={() => navigate("/financial-advisor")}
          >
            <div className="absolute top-4 left-4 text-xl font-bold text-primary/20">Financial Advisor</div>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Get financial advice</span>
            </div>
          </div>

          {/* Section C */}
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-xl font-bold text-primary/20">C</div>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Section C Content</span>
            </div>
          </div>

          {/* Section D */}
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-xl font-bold text-primary/20">D</div>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Section D Content</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
