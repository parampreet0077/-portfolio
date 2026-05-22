export function Button({ children, variant = "primary", className = "", ...props }) {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-purple-500/20",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-gray-600 hover:bg-gray-100"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
