
import { useState } from "react";
import { toast } from "sonner";

const ExpenseForm = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    income: "",
    primaryExpenses: {
      housing: "",
      utilities: "",
      groceries: "",
    },
    secondaryExpenses: {
      entertainment: "",
      travel: "",
    },
    investments: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      income: parseFloat(formData.income) || 0,
      primaryExpenses: Object.fromEntries(
        Object.entries(formData.primaryExpenses).map(([key, value]) => [
          key,
          parseFloat(value) || 0,
        ])
      ),
      secondaryExpenses: Object.fromEntries(
        Object.entries(formData.secondaryExpenses).map(([key, value]) => [
          key,
          parseFloat(value) || 0,
        ])
      ),
      investments: parseFloat(formData.investments) || 0,
    };
    onUpdate(processedData);
    toast.success("Expenses updated successfully!");
  };

  const handleChange = (category, field, value) => {
    if (category === "root") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value,
        },
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Expense Details</h2>
        <p className="text-sm text-gray-500">Enter your monthly expenses</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income
          </label>
          <input
            type="number"
            value={formData.income}
            onChange={(e) => handleChange("root", "income", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Primary Expenses
          </h3>
          <div className="space-y-4">
            {Object.entries({
              housing: "Rent/Mortgage",
              utilities: "Electricity, Water, etc.",
              groceries: "Food & Supplies",
            }).map(([key, placeholder]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key}
                </label>
                <input
                  type="number"
                  value={formData.primaryExpenses[key]}
                  onChange={(e) =>
                    handleChange("primaryExpenses", key, e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Secondary Expenses
          </h3>
          <div className="space-y-4">
            {Object.entries({
              entertainment: "Movies, Dining out, etc.",
              travel: "Transportation & Trips",
            }).map(([key, placeholder]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key}
                </label>
                <input
                  type="number"
                  value={formData.secondaryExpenses[key]}
                  onChange={(e) =>
                    handleChange("secondaryExpenses", key, e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Investments
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Investments
            </label>
            <input
              type="number"
              value={formData.investments}
              onChange={(e) => handleChange("root", "investments", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Stocks, Mutual Funds, etc."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Update Expenses
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
