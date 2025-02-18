import { useState } from "react";
import { Button } from "@/components/ui/button";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChartBar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const SecondaryExpenses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasInvestments, setHasInvestments] = useState("no");
  const [formData, setFormData] = useState({
    travel: "",
    entertainment: "",
    medical: "",
    luxury: "",
    investmentType: "",
    investmentAmount: "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleInvestmentTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      investmentType: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    const requiredFields = ['travel', 'entertainment', 'medical', 'luxury'];
    if (hasInvestments === 'yes') {
      requiredFields.push('investmentType', 'investmentAmount');
    }

    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Success",
      description: "Your secondary expenses have been saved!",
    });
    
    setIsLoading(false);
    navigate("/goal-tracker"); // Redirect to dashboard after form submission
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="w-full max-w-2xl px-8 py-12 relative">
        {/* Background decorative elements */}
        <div className="absolute -z-10 inset-0 bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl" />
        <div className="absolute -z-20 -inset-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-[2rem] opacity-50 blur-2xl" />

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/5 rounded-2xl mb-4">
            <ChartBar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Secondary Expenses & Investments</h1>
          <p className="text-sm text-gray-500 mt-1">Let's track your lifestyle expenses</p>
        </div>

        {/* Logout Button */}
        <div className="absolute top-4 right-4">
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
            Logout
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingLabelInput
            label="Travel (₹)"
            type="number"
            value={formData.travel}
            onChange={handleChange("travel")}
            className="bg-white text-black"
          />

          <FloatingLabelInput
            label="Entertainment (₹)"
            type="number"
            value={formData.entertainment}
            onChange={handleChange("entertainment")}
            className="bg-white text-black"
          />

          <FloatingLabelInput
            label="Medical (₹)"
            type="number"
            value={formData.medical}
            onChange={handleChange("medical")}
            className="bg-white text-black"
          />

          <FloatingLabelInput
            label="Luxury (₹)"
            type="number"
            value={formData.luxury}
            onChange={handleChange("luxury")}
            className="bg-white text-black"
          />

          <div className="space-y-4">
            <Label>Investments (Optional)</Label>
            <RadioGroup
              defaultValue="no"
              onValueChange={(value) => setHasInvestments(value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          {hasInvestments === "yes" && (
            <div className="space-y-6 animate-fade-in">
              <Select onValueChange={handleInvestmentTypeChange}>
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Select Investment Type" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg">
                  <SelectItem value="bonds">Bonds</SelectItem>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="shares">Shares</SelectItem>
                  <SelectItem value="fd">Fixed Deposits</SelectItem>
                  <SelectItem value="realestate">Real Estate</SelectItem>
                  <SelectItem value="mutualfunds">Mutual Funds</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                </SelectContent>
              </Select>

              <FloatingLabelInput
                label="Investment Amount (₹)"
                type="number"
                value={formData.investmentAmount}
                onChange={handleChange("investmentAmount")}
                className="bg-white text-black"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            Finish
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SecondaryExpenses;
