export function Table({ headers, children }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 bg-white">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 border-b border-gray-100">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-6 py-4 font-medium">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children }) {
  return <tr className="hover:bg-gray-50/50 transition-colors">{children}</tr>;
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>;
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableTableRow({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative',
    backgroundColor: isDragging ? '#f8fafc' : undefined,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-4 w-10 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-600" {...attributes} {...listeners}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/></svg>
      </td>
      {children}
    </tr>
  );
}
