import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import Starfield from "./components/Starfield";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
      <ScrollProgress />
      <Navbar />
      
      {/* Global Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Starfield />
      </div>

      <motion.main 
        className="relative z-10"
        initial={{ opacity: 0 }} 
        animate={{ opacity: loading ? 0 : 1 }} 
        transition={{ duration: 0.45 }}
      >
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Resume />
        <Contact />
      </motion.main>
      <div className="relative z-10">
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}
