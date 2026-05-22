import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { api, fileUrl } from "../api";
import SectionTitle from "./SectionTitle";

export default function Projects() {
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data)).catch(() => setProjects([]));
  }, []);

  return (
    <section id="projects" className="section-pad bg-transparent">
      <div className="container-xl relative z-10">
        <SectionTitle label="Projects" title="Selected Work" />
        {!projects ? <div className="empty-state text-gray-400">Loading projects...</div> : projects.length === 0 ? <div className="empty-state premium-card text-gray-400">No projects yet</div> : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article key={project._id} className="premium-card group overflow-hidden rounded-[20px] hover:border-l-[3px] hover:border-l-cyan-400" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <a href={project.liveDemoLink || project.githubLink || "#"} target="_blank" rel="noreferrer" className="relative block h-[200px] bg-white/5 border-b border-white/10">
                  {project.thumbnail ? <img src={fileUrl(project.thumbnail)} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-4xl font-extrabold text-cyan-500/20 drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]">PS</div>}
                  <div className="absolute inset-0 grid place-items-center bg-[#0a0a0f]/80 text-sm font-bold text-white opacity-0 transition duration-300 group-hover:opacity-100 backdrop-blur-sm">View Project <FaExternalLinkAlt className="ml-2 inline" /></div>
                </a>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">{project.techStack?.map((tech) => <span key={tech} className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 text-xs font-semibold text-cyan-300 shadow-[0_0_5px_rgba(124,58,237,0.2)]">{tech}</span>)}</div>
                  <h3 className="my-3 font-heading text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{project.title}</h3>
                  <p className="mb-5 line-clamp-2 text-sm leading-6 text-gray-400">{project.shortDescription || project.fullDescription}</p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    {project.githubLink ? (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-gray-300 hover:text-cyan-400 transition-colors"><FaGithub />Code</a>
                    ) : <div />}
                    {project.liveDemoLink ? (
                      <a href={project.liveDemoLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-bold text-white hover:bg-purple-500 shadow-[0_0_10px_rgba(124,58,237,0.4)] transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.6)]"><FaExternalLinkAlt />Live Demo</a>
                    ) : <div />}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
