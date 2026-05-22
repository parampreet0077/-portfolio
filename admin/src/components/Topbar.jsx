import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api";

export default function Topbar() {
  const location = useLocation();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    api.get("/settings").then((res) => setAdmin(res.data)).catch(() => {});
  }, []);

  const getPageTitle = () => {
    const path = location.pathname.split("/")[1];
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <h1 className="text-xl font-bold text-gray-800">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>
        
        <button className="relative p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-700">{admin?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">Superadmin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold overflow-hidden border-2 border-white shadow-sm">
            {admin?.profileImage ? (
              <img src={admin.profileImage.startsWith("http") ? admin.profileImage : `http://localhost:5000${admin.profileImage}`} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              (admin?.name || "A").charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
