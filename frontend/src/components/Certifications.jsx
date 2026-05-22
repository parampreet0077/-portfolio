import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaAward } from "react-icons/fa";
import { useEffect, useState } from "react";
import { api, fileUrl } from "../api";
import SectionTitle from "./SectionTitle";

export default function Certifications() {
  const [certifications, setCertifications] = useState(null);
  useEffect(() => {
    api.get("/certifications").then((res) => setCertifications(res.data)).catch(() => setCertifications([]));
  }, []);

  if (certifications && certifications.length === 0) return null;

  return (
    <section id="certifications" className="section-pad bg-transparent">
      <div className="container-xl relative z-10">
        <SectionTitle label="Certifications" title="Licenses & Certifications" />
        {!certifications ? <div className="empty-state text-gray-400">Loading certifications...</div> : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, index) => (
              <motion.article key={cert._id} className="premium-card group overflow-hidden rounded-[20px] hover:border-l-[3px] hover:border-l-purple-400" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <div className="relative block h-[180px] bg-white/5 border-b border-white/10 p-6 flex flex-col justify-center items-center text-center">
                  {cert.certificateImage ? (
                    <img src={fileUrl(cert.certificateImage)} className="h-full w-full object-contain" alt={cert.certificateName} />
                  ) : (
                    <FaAward className="text-6xl text-purple-500/50 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                  )}
                  {cert.credentialLink && (
                    <a href={cert.credentialLink} target="_blank" rel="noreferrer" className="absolute inset-0 grid place-items-center bg-[#0a0a0f]/80 text-sm font-bold text-white opacity-0 transition duration-300 group-hover:opacity-100 backdrop-blur-sm">
                      View Credential <FaExternalLinkAlt className="ml-2 inline" />
                    </a>
                  )}
                </div>
                <div className="p-5 flex flex-col h-[calc(100%-180px)]">
                  <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 text-[10px] font-bold text-cyan-300 shadow-[0_0_5px_rgba(6,182,212,0.2)] w-max uppercase tracking-wider mb-2">
                    {cert.date}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-tight mb-1">{cert.certificateName}</h3>
                  <p className="text-sm font-medium text-gray-400 mb-4">{cert.issuer}</p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-end">
                    {cert.credentialLink ? (
                      <a href={cert.credentialLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-purple-400 hover:text-purple-300 transition-colors text-sm">
                        Verify <FaExternalLinkAlt size={12} />
                      </a>
                    ) : <span className="text-xs text-gray-600 font-medium">Verified</span>}
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
