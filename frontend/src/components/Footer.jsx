import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";
import { api } from "../api";

export default function Footer() {
  const [contact, setContact] = useState({});
  const [about, setAbout] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/about").catch(() => ({ data: {} })),
      api.get("/contact").catch(() => ({ data: {} }))
    ]).then(([aboutRes, contactRes]) => {
      setAbout(aboutRes.data);
      setContact(contactRes.data);
    });
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

  const socialLinks = contact.socialLinks || {};
  const socials = [[FaGithub, socialLinks.github], [FaLinkedin, socialLinks.linkedin], [FaInstagram, socialLinks.instagram], [FaTwitter, socialLinks.twitter]];

  const fullName = about?.fullName || "Parampreet Singh";

  return (
    <footer className="bg-[#0a0a0f]/80 backdrop-blur-md border-t border-white/10 py-14 text-white relative z-10">
      <div className="container-xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div><div className="mb-3 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 font-extrabold shadow-[0_0_10px_rgba(124,58,237,0.4)]">{getInitials(about?.fullName)}</span><strong>{fullName}</strong></div><p className="text-gray-400">Building the future, one line at a time.</p></div>
          <div className="flex flex-wrap gap-5">{["Home", "About", "Skills", "Projects", "Resume", "Contact"].map((link) => <button key={link} onClick={() => document.getElementById(link === "Home" ? "home" : link.toLowerCase())?.scrollIntoView({ behavior: "smooth" })} className="text-gray-400 hover:text-cyan-400 transition-colors">{link}</button>)}</div>
        </div>
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
        <div className="mb-7 flex justify-center gap-4">{socials.map(([Icon, href], i) => <a key={i} href={href || "#"} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 border border-white/10 hover:scale-110 hover:bg-purple-500/30 hover:border-purple-500/50 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all duration-300"><Icon /></a>)}</div>
        <p className="text-center text-sm text-gray-500">Built with ❤️ and ☕ by {fullName} • © {new Date().getFullYear()} All rights reserved</p>
      </div>
    </footer>
  );
}
