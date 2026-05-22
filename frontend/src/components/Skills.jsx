import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../api";
import SectionTitle from "./SectionTitle";
import IconRenderer from "./IconRenderer";

export default function Skills() {
  const [skills, setSkills] = useState(null);
  useEffect(() => {
    api.get("/skills").then((res) => setSkills(res.data)).catch(() => setSkills([]));
  }, []);

  const groupedSkills = skills ? skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {}) : {};

  return (
    <section id="skills" className="section-pad bg-transparent">
      <div className="container-xl relative z-10">
        <SectionTitle label="Skills" title="Capabilities & Tools" />
        {!skills ? <div className="empty-state text-gray-400">Loading skills...</div> : skills.length === 0 ? <div className="empty-state premium-card text-gray-400">No skills yet</div> : (
          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, items], catIndex) => (
              <div key={category}>
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block pr-8">{category}</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((skill, index) => (
                    <motion.div key={skill._id} className="premium-card p-6 hover:border-cyan-400/50 group" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                      <div className="mb-4 flex items-center gap-3">
                        <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center justify-center transition-transform group-hover:scale-110" style={{ color: skill.colorTheme || '#22d3ee' }}>
                          <IconRenderer iconName={skill.icon} size={28} />
                        </span>
                        <div className="flex-1">
                          <h3 className="font-heading text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{skill.skillName}</h3>
                          <p className="text-xs text-gray-400 font-semibold">{skill.experienceLevel || "Beginner"}</p>
                        </div>
                        {skill.percentage > 0 && <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-sm font-bold text-cyan-400 shadow-[0_0_5px_rgba(124,58,237,0.2)]">{skill.percentage}%</span>}
                      </div>
                      
                      {skill.percentage > 0 && (
                        <div className="h-2 overflow-hidden rounded-full bg-white/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] mt-5">
                          <motion.div className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]" initial={{ width: 0 }} whileInView={{ width: `${skill.percentage}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}>
                            <span className="absolute inset-y-0 w-16 bg-white/30" style={{ animation: "shimmer 1.5s infinite" }} />
                          </motion.div>
                        </div>
                      )}
                      
                      {skill.category === "Education" && skill.educationData?.courseName && (
                        <div className="mt-5 text-sm text-gray-400 bg-white/5 p-3.5 rounded-xl border border-white/5 shadow-inner">
                          <p className="text-gray-200 font-bold mb-1">{skill.educationData.courseName}</p>
                          <p className="text-xs text-cyan-400/80">{skill.educationData.platform} <span className="text-gray-600 px-1">•</span> {skill.educationData.duration}</p>
                        </div>
                      )}
                      
                      {skill.category === "Programming" && skill.programmingData?.projectsUsedIn > 0 && (
                        <div className="mt-5 text-xs font-bold text-purple-300 flex items-center gap-2 bg-purple-900/20 p-2.5 rounded-lg border border-purple-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span> Used in {skill.programmingData.projectsUsedIn} projects
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
