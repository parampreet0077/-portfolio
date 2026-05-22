import { motion } from "framer-motion";
import { Mail, Phone, Send } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api";
import SectionTitle from "./SectionTitle";

export default function Contact() {
  const [contact, setContact] = useState({});
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/contact").then((res) => setContact(res.data)).catch(() => {});
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error("Please fill name, email, and message.");
    setSending(true);
    try {
      await api.post("/messages", form);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent! I'll get back to you soon. 🚀");
    } catch {
      toast.error("Could not send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const socialLinks = contact.socialLinks || {};
  const cards = [
    { label: "Email", value: contact.email, Icon: Mail, href: contact.email && `mailto:${contact.email}` },
    { label: "Phone", value: contact.phone, Icon: Phone, href: contact.phone && `tel:${contact.phone}` },
    { label: "LinkedIn", value: socialLinks.linkedin, Icon: FaLinkedin, href: socialLinks.linkedin },
    { label: "Instagram", value: socialLinks.instagram, Icon: FaInstagram, href: socialLinks.instagram }
  ].filter(card => card.value);

  return (
    <section id="contact" className="section-pad bg-transparent">
      <div className="container-xl relative z-10">
        <SectionTitle label="Contact" title="Let's Build Something" />
        <div className="grid gap-[60px] lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="gradient-text mb-3 font-heading text-3xl font-extrabold">Get In Touch</h3>
            <p className="mb-7 text-gray-400">I'm always open to discussing new opportunities.</p>
            <div className="space-y-4">
              {cards.length > 0 ? cards.map(({label, value, Icon, href}) => {
                const content = (
                  <>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-purple-500/20 text-cyan-400 border border-purple-500/30 shadow-[0_0_10px_rgba(124,58,237,0.2)] group-hover:text-purple-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block text-xs font-bold uppercase text-gray-500">{label}</span>
                      <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">{value}</span>
                    </span>
                  </>
                );
                return href ? (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="premium-card group flex items-center gap-4 rounded-[14px] p-5 hover:translate-x-1 hover:border-cyan-500/50">
                    {content}
                  </a>
                ) : (
                  <div key={label} className="premium-card flex items-center gap-4 rounded-[14px] p-5">
                    {content}
                  </div>
                );
              }) : (
                <div className="text-gray-500 text-sm">Contact information will be updated soon.</div>
              )}
            </div>
          </motion.div>
          <motion.form onSubmit={submit} className="premium-card rounded-[20px] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-shadow" initial={{ opacity: 0, x: 36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="space-y-4">
              <input className="input" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" placeholder="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <textarea className="input min-h-[140px] resize-y" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <button className="btn-primary w-full py-3.5 group" disabled={sending}>{sending ? "Sending..." : <><Send size={18} className="group-hover:translate-x-1 transition-transform" />Send Message</>}</button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
