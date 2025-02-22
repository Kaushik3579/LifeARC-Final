import { useState, useEffect } from "react";
import { toast } from "sonner";
import { auth, db, doc, getDoc, setDoc } from "@/firebase";

const ExpenseForm = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    income: "",
    housing: "",
    bills: "",
    groceries: "",
    education: "",
    insurance: "",
    loans: "",
    medication: "",
    provident: "",
    entertainment: "",
    travel: "",
    luxury: "",
    medical: "",
    investments: ""
  });
  const [loading, setLoading] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchExpenseData = async () => {
      if (!mounted || isDataFetched) return;

      try {
        setLoading(true);
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (!user) {
            toast.error("Please log in to view expenses");
            if (mounted) setLoading(false);
            return;
          }

          console.log("Fetching data for user:", user.uid);

          // Use lowercase collection names
          const primaryDocRef = doc(db, "expenses", user.uid);
          const secondaryDocRef = doc(db, "secondaryExpenses", user.uid);
          
          const [primarySnap, secondarySnap] = await Promise.all([
            getDoc(primaryDocRef),
            getDoc(secondaryDocRef)
          ]);

          console.log("Primary snapshot exists:", primarySnap.exists());
          console.log("Secondary snapshot exists:", secondarySnap.exists());

          let primaryData = {};
          let secondaryData = {};

          if (primarySnap.exists()) {
            primaryData = primarySnap.data();
            console.log("Primary data:", primaryData);
          } else {
            console.log("No primary expenses found - initializing empty document");
            await setDoc(doc(db, "expenses", user.uid), {}, { merge: true });
          }

          if (secondarySnap.exists()) {
            secondaryData = secondarySnap.data();
            console.log("Secondary data:", secondaryData);
          } else {
            console.log("No secondary expenses found - initializing empty document");
            await setDoc(doc(db, "secondaryExpenses", user.uid), { timestamp: new Date().toISOString() }, { merge: true });
          }

          const billsTotal = parseFloat(primaryData.mobile || 0) + 
                           parseFloat(primaryData.water || 0) + 
                           parseFloat(primaryData.gas || 0) + 
                           parseFloat(primaryData.electricity || 0);

          if (mounted) {
            setFormData({
              income: primaryData.income || "",
              housing: primaryData.housing || "",
              bills: billsTotal.toString() || "",
              groceries: primaryData.groceries || "",
              education: primaryData.education || "",
              insurance: primaryData.insurance || "",
              loans: primaryData.loans || "",
              medication: primaryData.medication || "",
              provident: primaryData.provident || "",
              entertainment: secondaryData.entertainment || "",
              travel: secondaryData.travel || "",
              luxury: secondaryData.luxury || "",
              medical: secondaryData.medical || "",
              investments: secondaryData.investmentAmount || ""
            });
            setIsDataFetched(true);
            toast.success("Expense data loaded successfully");
          }
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error fetching expense data: " + error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchExpenseData();

    return () => {
      mounted = false;
    };
  }, [isDataFetched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to update expenses");
        return;
      }

      const billsValue = parseFloat(formData.bills) || 0;
      const individualBill = billsValue / 4;

      const primaryExpensesData = {
        income: formData.income,
        housing: formData.housing,
        mobile: individualBill.toString(),
        water: individualBill.toString(),
        gas: individualBill.toString(),
        electricity: individualBill.toString(),
        groceries: formData.groceries,
        education: formData.education,
        insurance: formData.insurance,
        loans: formData.loans,
        medication: formData.medication,
        provident: formData.provident
      };

      const secondaryExpensesData = {
        entertainment: formData.entertainment,
        travel: formData.travel,
        luxury: formData.luxury,
        medical: formData.medical,
        investmentAmount: formData.investments,
        timestamp: new Date().toISOString()
      };

      // Use lowercase collection names
      await Promise.all([
        setDoc(doc(db, "expenses", user.uid), primaryExpensesData, { merge: true }),
        setDoc(doc(db, "secondaryExpenses", user.uid), secondaryExpensesData, { merge: true })
      ]);

      const processedData = {
        income: parseFloat(formData.income) || 0,
        primaryExpenses: {
          housing: parseFloat(formData.housing) || 0,
          utilities: parseFloat(formData.bills) || 0,
          groceries: parseFloat(formData.groceries) || 0,
          education: parseFloat(formData.education) || 0,
          insurance: parseFloat(formData.insurance) || 0,
          loans: parseFloat(formData.loans) || 0,
          medication: parseFloat(formData.medication) || 0,
          provident: parseFloat(formData.provident) || 0
        },
        secondaryExpenses: {
          entertainment: parseFloat(formData.entertainment) || 0,
          travel: parseFloat(formData.travel) || 0,
          luxury: parseFloat(formData.luxury) || 0,
          medical: parseFloat(formData.medical) || 0
        },
        investments: parseFloat(formData.investments) || 0
      };

      onUpdate(processedData);
      toast.success("Expenses updated successfully!");
    } catch (error) {
      toast.error("Error updating expenses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <div className="p-6">Loading expense data...</div>;
  }

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
            onChange={(e) => handleChange("income", e.target.value)}
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
              bills: "Mobile + Water + Gas + Electricity",
              groceries: "Food & Supplies",
              education: "Education",
              insurance: "Insurance",
              loans: "Loans",
              medication: "Medication",
              provident: "Provident Fund"
            }).map(([key, placeholder]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key}
                </label>
                <input
                  type="number"
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
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
              luxury: "Luxury Items",
              medical: "Medical Expenses"
            }).map(([key, placeholder]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key}
                </label>
                <input
                  type="number"
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
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
              onChange={(e) => handleChange("investments", e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Stocks, Mutual Funds, etc."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Expenses"}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;