import { motion } from "framer-motion";
import { FileText, Briefcase, GraduationCap } from "lucide-react";
import { FaDownload } from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, downloadResume, fileUrl } from "../api";
import SectionTitle from "./SectionTitle";

export default function Resume() {
  const [resume, setResume] = useState({});
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    api.get("/resume").then((res) => setResume(res.data)).catch(() => {});
    api.get("/education").then((res) => setEducation(res.data)).catch(() => {});
    api.get("/experience").then((res) => setExperience(res.data)).catch(() => {});
  }, []);

  const handleDownload = async () => {
    try {
      await downloadResume();
    } catch {
      toast.error("Resume is not available yet.");
    }
  };

  return (
    <section id="resume" className="section-pad bg-transparent">
      <div className="container-xl relative z-10">
        <SectionTitle label="Resume" title="My Journey" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Experience Timeline */}
          {experience.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Experience</h3>
              </div>
              <div className="space-y-8 border-l border-cyan-500/30 ml-6 pl-8 relative">
                {experience.map((item, index) => (
                  <motion.div key={item._id} className="relative group" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                    <span className="absolute -left-[43px] top-1 w-5 h-5 rounded-full bg-cyan-500 border-4 border-[#0B0F19] group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    <div className="premium-card p-6 rounded-2xl hover:border-cyan-400/50">
                      <span className="text-cyan-400 text-sm font-bold tracking-wider uppercase mb-1 block">{item.duration}</span>
                      <h4 className="text-xl font-bold text-white mb-1">{item.role}</h4>
                      <p className="text-purple-400 font-medium mb-3">{item.companyName}</p>
                      {item.responsibilities && <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.responsibilities}</p>}
                      {item.technologiesUsed?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.technologiesUsed.map(tech => (
                            <span key={tech} className="px-2.5 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-300">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Education Timeline */}
          {education.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Education</h3>
              </div>
              <div className="space-y-8 border-l border-purple-500/30 ml-6 pl-8 relative">
                {education.map((item, index) => (
                  <motion.div key={item._id} className="relative group" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                    <span className="absolute -left-[43px] top-1 w-5 h-5 rounded-full bg-purple-500 border-4 border-[#0B0F19] group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                    <div className="premium-card p-6 rounded-2xl hover:border-purple-400/50">
                      <span className="text-purple-400 text-sm font-bold tracking-wider uppercase mb-1 block">{item.startYear} - {item.endYear}</span>
                      <h4 className="text-xl font-bold text-white mb-1">{item.degree}</h4>
                      <p className="text-cyan-400 font-medium mb-3">{item.institution}</p>
                      {item.percentage && <p className="text-gray-300 font-semibold mb-2 text-sm bg-white/5 inline-block px-3 py-1 rounded-lg border border-white/10">Grade: {item.percentage}</p>}
                      {item.description && <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download CV Card */}
        <motion.div className="premium-card mx-auto max-w-[600px] rounded-2xl px-8 py-14 text-center hover:border-cyan-400/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"><FileText size={38} /></div>
          <h3 className="gradient-text mb-3 font-heading text-3xl font-extrabold">Full PDF Resume</h3>
          <p className="mx-auto mb-4 max-w-md text-gray-400">Download my latest resume for a complete overview of my experience and qualifications in a printable format.</p>
          <p className="mb-8 text-sm text-gray-500">Last updated: {resume.uploadDate ? new Date(resume.uploadDate).toLocaleDateString() : "Not uploaded yet"}</p>
          <button onClick={handleDownload} className="btn-primary mx-auto w-full max-w-[320px] py-4 text-lg group"><FaDownload className="group-hover:-translate-y-1 transition-transform" />Download Resume</button>
        </motion.div>
      </div>
    </section>
  );
}
