export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
      <div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
