import React from 'react';
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, className, value, onChange, ...props }, ref) => {
    return (
      <div className="relative mb-6">
        <input
          {...props}
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            "peer w-full h-14 bg-white/5 backdrop-blur-xl border border-gray-200 rounded-lg px-4 pt-4 pb-1.5 text-sm outline-none transition-all",
            "focus:ring-2 focus:ring-primary/20",
            "placeholder-shown:pt-3",
            error ? "border-red-500" : "focus:border-primary",
            className
          )}
          placeholder=" "
        />
        <label
          className={cn(
            "absolute left-4 top-1 text-xs text-gray-500 transition-all duration-200",
            "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm",
            "peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary",
            value && "top-1 text-xs"
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export default FloatingLabelInput;
