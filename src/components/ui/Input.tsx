import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.replace(/\s+/g, "-").toLowerCase();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-sand-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors duration-200
            bg-white text-sand-900 placeholder:text-sand-400
            ${
              error
                ? "border-rainbow-red focus:ring-2 focus:ring-rainbow-red/20 focus:border-rainbow-red"
                : "border-sand-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            }
            outline-none
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-rainbow-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
