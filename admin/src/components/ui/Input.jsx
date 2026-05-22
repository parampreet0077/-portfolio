import { forwardRef } from "react";

export const Input = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 ${
          error ? "border-red-300" : "border-gray-200"
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 min-h-[100px] resize-y ${
          error ? "border-red-300" : "border-gray-200"
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
});
