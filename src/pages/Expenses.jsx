import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { useToast } from "@/components/ui/use-toast";
import { ChartBar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase"; // Import Firebase config
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions

const Expenses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    income: "",
    housing: "",
    electricity: "",
    water: "",
    gas: "",
    mobile: "",
    insurance: "",
    loans: "",
    provident: "",
    education: "",
    medication: "",
    groceries: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "expenses", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      }
    };
    fetchData();
  }, []);

  const handleChange = (field) => async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "expenses", user.uid), {
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const emptyFields = Object.entries(formData).filter(([_, value]) => !value);
    if (emptyFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      setIsLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        ...formData,
        timestamp: serverTimestamp(), // Save with timestamp
      });

      toast({
        title: "Success",
        description: "Your expenses have been saved!",
      });

      navigate("/secondary-expenses");
    } catch (error) {
      console.error("Error saving data: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save expenses",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="w-full max-w-2xl px-8 py-12 relative">
        <div className="absolute -z-10 inset-0 bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl" />
        <div className="absolute -z-20 -inset-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-[2rem] opacity-50 blur-2xl" />

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/5 rounded-2xl mb-4">
            <ChartBar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Primary Needs & Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">Let's understand your monthly expenses</p>
        </div>

        <div className="absolute top-4 right-4">
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
            Logout
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FloatingLabelInput
              label="Monthly Income"
              type="number"
              value={formData.income}
              onChange={handleChange("income")}
            />
          </div>

          <FloatingLabelInput label="Housing" type="number" value={formData.housing} onChange={handleChange("housing")} />
          <FloatingLabelInput label="Electricity" type="number" value={formData.electricity} onChange={handleChange("electricity")} />
          <FloatingLabelInput label="Water" type="number" value={formData.water} onChange={handleChange("water")} />
          <FloatingLabelInput label="Gas" type="number" value={formData.gas} onChange={handleChange("gas")} />
          <FloatingLabelInput label="Mobile" type="number" value={formData.mobile} onChange={handleChange("mobile")} />
          <FloatingLabelInput label="Insurance" type="number" value={formData.insurance} onChange={handleChange("insurance")} />
          <FloatingLabelInput label="Loans" type="number" value={formData.loans} onChange={handleChange("loans")} />
          <FloatingLabelInput label="Provident Fund" type="number" value={formData.provident} onChange={handleChange("provident")} />
          <FloatingLabelInput label="Education" type="number" value={formData.education} onChange={handleChange("education")} />
          <FloatingLabelInput label="Medication" type="number" value={formData.medication} onChange={handleChange("medication")} />
          <FloatingLabelInput label="Groceries" type="number" value={formData.groceries} onChange={handleChange("groceries")} />

          <div className="md:col-span-2 pt-4">
            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-black rounded-lg font-medium flex items-center justify-center gap-2" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Expenses;
