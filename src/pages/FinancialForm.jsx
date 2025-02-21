import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import { auth } from "@/firebase"; // Add this import

const FinancialForm = ({ onSubmit = () => {}, isSubmitting = false }) => { // Use default parameters
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

  const [formData, setFormData] = useState(form.defaultValues);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "financialForm", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
          form.reset(docSnap.data()); // Reset form with fetched data
        }
      }
    };
    fetchData();
  }, [form]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    form.setValue(field, value); // Update form value
  };

  const handleSubmit = (values) => {
    const numericValues = {
      income: parseFloat(values.income),
      primaryExpenses: parseFloat(values.primaryExpenses),
      entertainment: parseFloat(values.entertainment),
      travel: parseFloat(values.travel),
      lifestyle: parseFloat(values.lifestyle),
      medical: parseFloat(values.medical),
      otherExpenses: parseFloat(values.otherExpenses),
      inflationRate: parseFloat(values.inflationRate),
      event: values.event,
      totalExpenses: 
        parseFloat(values.primaryExpenses) +
        parseFloat(values.entertainment) +
        parseFloat(values.travel) +
        parseFloat(values.lifestyle) +
        parseFloat(values.medical) +
        parseFloat(values.otherExpenses),
    };
    onSubmit(numericValues);
    navigate("/financial-advisor"); // Updated to an existing route
  };

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
              rules={{ required: "This field is required" }}  // Added required rule
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
              rules={{ required: "This field is required" }}  // Added required rule
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
              rules={{ required: "This field is required" }}  // Added required rule
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
              rules={{ required: "This field is required" }}  // Added required rule
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
              rules={{ required: "This field is required" }}  // Added required rule
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
              rules={{ required: "This field is required" }}  // Added required rule
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
              rules={{ required: "This field is required" }}  // Added required rule
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
              rules={{ required: "This field is required" }}  // Added required rule
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
              rules={{ required: "This field is required" }}  // Added required rule for dropdown
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Financial Event</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white"> {/* Added solid background */}
                        <SelectValue placeholder="Select a financial event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? "Analyzing..." : "Analyze Finances"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </Card>
  );
};

export default FinancialForm;