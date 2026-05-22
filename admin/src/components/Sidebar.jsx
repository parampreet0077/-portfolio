import { Briefcase, FileText, LayoutDashboard, LogOut, Mail, MessageSquare, Settings, User, Zap, Award } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

const nav = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/about", "About", User],
  ["/skills", "Skills", Zap],
  ["/projects", "Projects", Briefcase],
  ["/resume", "Resume", FileText],
  ["/certifications", "Certifications", Award],
  ["/contact", "Contact", Mail],
  ["/messages", "Messages", MessageSquare],
  ["/settings", "Settings", Settings]
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get("/messages").then((res) => {
      setUnread(res.data.filter((m) => m.status === "unread").length);
    }).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem("ps_token");
    localStorage.removeItem("ps_email");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-gray-100 bg-white p-5 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="mb-10 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-600 font-extrabold text-white shadow-sm shadow-purple-500/20">PS</span>
        <div>
          <strong className="text-gray-800 tracking-tight">Portfolio CMS</strong>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Admin Panel</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2">
        {nav.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive ? "bg-purple-50 text-purple-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
            <Icon size={18} className={({ isActive }) => isActive ? "text-purple-600" : "text-gray-400"} /> 
            {label}
            {label === "Messages" && unread > 0 && <span className="ml-auto grid h-5 min-w-[20px] place-items-center rounded-full bg-purple-500 px-1.5 text-[10px] font-bold text-white">{unread}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-5 mt-4">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={18} />Logout
        </button>
      </div>
    </aside>
  );
}
