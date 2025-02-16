import { useState } from "react";
import { Button } from "@/components/ui/button";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { useToast } from "@/components/ui/use-toast";
import { ChartBar, DollarSign, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
    } else {
      toast({
        title: "Success",
        description: "Welcome back!",
      });
      navigate("/expenses");
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // Simulate Google auth
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Google Sign In",
      description: "This feature will be connected to Google Auth soon!",
    });
    setIsLoading(false);
    navigate("/expenses");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md px-8 py-12 relative">
        <div className="absolute -z-10 inset-0 bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl" />
        <div className="absolute -z-20 -inset-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-[2rem] opacity-50 blur-2xl" />

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/5 rounded-2xl mb-4">
            <ChartBar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="mb-6">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-gray-500 bg-white">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingLabelInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <FloatingLabelInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="pt-2">
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LockKeyhole className="w-4 h-4" />
                  Sign In
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up
            </a>
          </p>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-green-500">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">1,234.56</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
