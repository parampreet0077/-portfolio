import { motion } from "framer-motion";
import { Download, ChevronDown, Shield, Code2, Database, Terminal } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, downloadResume } from "../api";
import IconRenderer from "./IconRenderer";

// Custom Name Glitch Reveal Component
const GlitchName = ({ finalName }) => {
  const [displayText, setDisplayText] = useState("");
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?/";
  
  useEffect(() => {
    let iteration = 0;
    let interval = null;
    
    // Delay start for the entrance sequence
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(
          finalName
            .split("")
            .map((letter, index) => {
              if (index < iteration) return finalName[index];
              return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("")
        );
        
        if (iteration >= finalName.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    }, 1000); // 1s delay
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [finalName]);

  return (
    <h1 className="mb-2 font-heading text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-tight text-white drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">
      {displayText}
      {displayText === finalName && (
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-[2px] w-full bg-gradient-to-r from-cyan-400 to-purple-500 mt-2 origin-left shadow-[0_0_10px_rgba(6,182,212,0.8)]"
        />
      )}
    </h1>
  );
};

export default function Hero() {
  const [contact, setContact] = useState({});
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const socialLinks = contact.socialLinks || {};

  useEffect(() => {
    Promise.all([
      api.get("/contact").catch(() => ({ data: {} })),
      api.get("/about").catch(() => ({ data: {} })),
      api.get("/skills").catch(() => ({ data: [] }))
    ]).then(([contactRes, aboutRes, skillsRes]) => {
      setContact(contactRes.data || {});
      setAbout(aboutRes.data || {});
      setSkills(skillsRes.data || []);
    });
  }, []);

  const roles = about?.title ? about.title.split(',').map(s => s.trim()) : ["Cyber Security Expert", "Prompt Engineer", "Full Stack Developer", "Software Developer"];
  const typeSequence = roles.flatMap(role => [role + " ⚡", 1800]);

  const handleDownload = async () => {
    try {
      await downloadResume();
    } catch {
      toast.error("Resume is not available yet.");
    }
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-transparent pt-20">
      <div className="container-xl relative z-10 grid items-center gap-[60px] py-20 md:grid-cols-2">
        {/* LEFT SIDE: Content */}
        <div className="text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-6 inline-flex rounded-full bg-purple-500/20 px-4 py-1.5 text-sm font-bold text-cyan-300 border border-purple-500/30 shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-[pulse-glow_3s_ease-in-out_infinite]"
          >
            👋 Hello, I'm
          </motion.div>
          
          <GlitchName finalName={about?.fullName || "Parampreet Singh"} />
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 2.0 }} // Wait for glitch
            className="mt-6 mb-5 text-[1.4rem] font-bold text-white flex flex-wrap items-center justify-center gap-2 md:justify-start"
          >
            <span>I'm a</span>
            <div className="bg-purple-900/40 border border-cyan-500/30 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <TypeAnimation 
                sequence={typeSequence.length ? typeSequence : ["Software Developer ⚡", 1800]} 
                repeat={Infinity} 
                cursor={false}
                className="custom-typewriter-cursor text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
              />
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mx-auto mb-8 max-w-[420px] text-base leading-7 text-gray-400 md:mx-0"
          >
            {about?.resumeIntro || about?.shortBio || "Crafting secure, intelligent, and scalable digital experiences."}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.8, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 md:justify-start"
          >
            <button onClick={handleDownload} className="btn-primary group">
              <Download size={18} className="group-hover:animate-bounce" />
              Download Resume
            </button>
            <a 
              href={socialLinks.linkedin || "#"} 
              target="_blank" 
              className="group inline-flex items-center gap-2 rounded-full border-2 border-cyan-500/50 px-6 py-3 font-bold text-cyan-400 hover:scale-[1.05] hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300" 
              rel="noreferrer"
            >
              <FaLinkedin className="group-hover:-translate-y-1 transition-transform" />LinkedIn
            </a>
            <a 
              href={socialLinks.instagram || "#"} 
              target="_blank" 
              className="group inline-flex items-center gap-2 rounded-full border-2 border-pink-500/50 px-6 py-3 font-bold text-pink-400 hover:scale-[1.05] hover:border-pink-400 hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all duration-300" 
              rel="noreferrer"
            >
              <FaInstagram className="group-hover:rotate-12 transition-transform" />Instagram
            </a>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Skill Cards Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-0 relative perspective-1000">
          {skills.slice(0, 4).map((skill, i) => (
              <motion.div
                key={skill._id || i}
                initial={{ opacity: 0, x: 100, rotateY: 30 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ delay: 2.0 + (i * 0.2), duration: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 group-hover:from-purple-500/40 group-hover:to-cyan-500/40 transition-colors duration-300 border border-white/5">
                  <IconRenderer iconName={skill.icon} size={32} className="text-cyan-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-white tracking-wide text-center">{skill.skillName}</h3>
              </motion.div>
          ))}
          {skills.length === 0 && (
            <div className="col-span-2 text-center text-gray-500 mt-10">Add skills in admin panel</div>
          )}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Explore</span>
        <ChevronDown size={24} className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-[bounceDown_1.6s_infinite]" />
      </motion.div>
    </section>
  );
}
