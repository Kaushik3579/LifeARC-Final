import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { toast } from "sonner";

const FinancialForm = ({ onSubmit = () => {}, isSubmitting = false }) => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      income: "",
      primaryExpenses: "",
      entertainment: "",
      travel: "",
      lifestyle: "",
      medical: "",
      otherExpenses: "",
      inflationRate: "",
      event: "",
    },
  });

  // Ensure formData is always an object by initializing with defaultValues
  const [formData, setFormData] = useState(form.getValues());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (!user) {
            toast.error("Please log in to view financial data");
            if (mounted) setLoading(false);
            return;
          }

          const primaryDocRef = doc(db, "expenses", user.uid);
          const secondaryDocRef = doc(db, "secondaryExpenses", user.uid);
          
          const [primarySnap, secondarySnap] = await Promise.all([
            getDoc(primaryDocRef),
            getDoc(secondaryDocRef)
          ]);

          let primaryData = {};
          let secondaryData = {};

          if (primarySnap.exists()) {
            primaryData = primarySnap.data();
            console.log("Primary data:", primaryData);
          }

          if (secondarySnap.exists()) {
            secondaryData = secondarySnap.data();
            console.log("Secondary data:", secondaryData);
          }

          const primaryExpensesSum = Object.entries(primaryData)
            .filter(([key]) => key !== "income")
            .reduce((sum, [, value]) => sum + (parseFloat(value) || 0), 0);

          const updatedFormData = {
            income: primaryData.income || "",
            primaryExpenses: primaryExpensesSum.toString() || "",
            entertainment: secondaryData.entertainment || "",
            travel: secondaryData.travel || "",
            lifestyle: secondaryData.luxury || "",
            medical: secondaryData.medical || "",
            otherExpenses: "0",
            inflationRate: "",
            event: ""
          };

          if (mounted) {
            setFormData(updatedFormData);
            form.reset(updatedFormData);
            toast.success("Financial data loaded successfully");
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Error fetching financial data: " + error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [form]);

  const handleChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    form.setValue(field, value);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to save financial data");
        return;
      }

      const numericValues = {
        income: parseFloat(values.income) || 0,
        primaryExpenses: parseFloat(values.primaryExpenses) || 0,
        entertainment: parseFloat(values.entertainment) || 0,
        travel: parseFloat(values.travel) || 0,
        lifestyle: parseFloat(values.lifestyle) || 0,
        medical: parseFloat(values.medical) || 0,
        otherExpenses: parseFloat(values.otherExpenses) || 0,
        inflationRate: parseFloat(values.inflationRate) || 0,
        event: values.event,
        totalExpenses: 
          parseFloat(values.primaryExpenses) +
          parseFloat(values.entertainment) +
          parseFloat(values.travel) +
          parseFloat(values.lifestyle) +
          parseFloat(values.medical) +
          parseFloat(values.otherExpenses),
      };

      const primaryExpensesData = {
        income: values.income,
      };

      const secondaryExpensesData = {
        entertainment: values.entertainment,
        travel: values.travel,
        luxury: values.lifestyle,
        medical: values.medical,
        timestamp: new Date().toISOString()
      };

      await Promise.all([
        setDoc(doc(db, "expenses", user.uid), primaryExpensesData, { merge: true }),
        setDoc(doc(db, "secondaryExpenses", user.uid), secondaryExpensesData, { merge: true })
      ]);

      onSubmit(numericValues);
      navigate("/financial-advisor");
      toast.success("Financial data saved successfully");
    } catch (error) {
      toast.error("Error saving financial data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading financial data...</div>;
  }

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl rounded-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Financial Analysis Form</h1>
        <p className="text-sm text-gray-500">Fill out the form below to analyze your financial status and get personalized advice.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FormField
              control={form.control}
              name="income"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} onChange={handleChange("income")} value={formData?.income || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primaryExpenses"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Expenses</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} onChange={handleChange("primaryExpenses")} value={formData?.primaryExpenses || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entertainment"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entertainment</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} onChange={handleChange("entertainment")} value={formData?.entertainment || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travel"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travel</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} onChange={handleChange("travel")} value={formData?.travel || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lifestyle"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lifestyle</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} onChange={handleChange("lifestyle")} value={formData?.lifestyle || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medical"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} onChange={handleChange("medical")} value={formData?.medical || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherExpenses"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Expenses</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} onChange={handleChange("otherExpenses")} value={formData?.otherExpenses || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inflationRate"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inflation Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} onChange={handleChange("inflationRate")} value={formData?.inflationRate || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Financial Event</FormLabel>
                  <Select onValueChange={(value) => handleChange("event")(value)} value={formData.event || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a financial event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800 shadow-lg rounded-md">
                      <SelectItem value="child_education">Child Education</SelectItem>
                      <SelectItem value="child_marriage">Child Marriage</SelectItem>
                      <SelectItem value="buying_car">Buying a Car</SelectItem>
                      <SelectItem value="medical_emergency">Medical Emergency</SelectItem>
                      <SelectItem value="home_renovation">Home Renovation</SelectItem>
                      <SelectItem value="job_loss">Job Loss</SelectItem>
                      <SelectItem value="vacation_planning">Vacation Planning</SelectItem>
                      <SelectItem value="retirement_planning">Retirement Planning</SelectItem>
                      <SelectItem value="starting_a_business">Starting a Business</SelectItem>
                      <SelectItem value="buying_a_house">Buying a House</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <Button type="submit" disabled={isSubmitting || loading} className="w-full md:w-auto">
              {isSubmitting || loading ? "Analyzing..." : "Analyze Finances"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </Card>
  );
};

export default FinancialForm;