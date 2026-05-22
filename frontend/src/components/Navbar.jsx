import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api";

const links = ["Home", "About", "Skills", "Projects", "Certifications", "Resume", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const [open, setOpen] = useState(false);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    api.get("/about").then((res) => setAbout(res.data)).catch(() => {});
  }, []);

  const getInitials = (name) => {
    if (!name) return "PS";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const current = links.findLast((link) => {
        const id = link === "Home" ? "home" : link.toLowerCase();
        const el = document.getElementById(id);
        return el && window.scrollY + 120 >= el.offsetTop;
      });
      if (current) setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (link) => {
    document.getElementById(link === "Home" ? "home" : link.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const NavLinks = ({ mobile = false }) => (
    <div className={mobile ? "flex flex-col gap-6 pt-8" : "hidden items-center gap-8 md:flex"}>
      {links.map((link) => (
        <button 
          key={link} 
          onClick={() => jump(link)} 
          className={`group relative px-1 py-2 text-sm font-semibold transition-colors duration-300 ${
            active === link ? "text-cyan-400" : "text-gray-400 hover:text-white"
          }`}
        >
          {link}
          {/* Sliding underline on hover */}
          <span className={`absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-transform duration-300 ${active === link ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} origin-left shadow-[0_0_8px_rgba(6,182,212,0.8)]`} />
        </button>
      ))}
    </div>
  );

  return (
    <header className={`fixed left-0 top-0 z-[100] w-full transition-all duration-300 ${
      scrolled 
        ? "h-16 bg-[#0a0a0f]/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5" 
        : "h-20 bg-transparent"
    }`}>
      {/* Top glowing border line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
      
      <nav className="container-xl flex h-full items-center justify-between">
        <button onClick={() => jump("Home")} className="flex items-center gap-3 group">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 font-extrabold text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
            {getInitials(about?.fullName)}
          </span>
          <span className="font-heading font-bold text-white tracking-wider group-hover:text-cyan-300 transition-colors duration-300">
            {about?.fullName || "Parampreet Singh"}
          </span>
        </button>

        <NavLinks />

        <button 
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-sm md:hidden hover:bg-white/10 transition-colors" 
          onClick={() => setOpen(true)} 
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setOpen(false)} 
            />
            <motion.aside 
              className="fixed right-0 top-0 z-50 h-screen w-72 bg-[#0a0a0f]/95 p-6 shadow-2xl backdrop-blur-xl border-l border-white/10 md:hidden" 
              initial={{ x: 320 }} 
              animate={{ x: 0 }} 
              exit={{ x: 320 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Menu</span>
                <button 
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white" 
                  onClick={() => setOpen(false)} 
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <NavLinks mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
