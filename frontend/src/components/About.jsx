import { motion } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import { api, fileUrl } from "../api";
import SectionTitle from "./SectionTitle";
import IconRenderer from "./IconRenderer";

const connections = [
  // Row 1: WELCOME (indices 0 to 6)
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  // Row 2: TO MY (indices 7 to 10)
  [7, 8], [8, 9], [9, 10],
  // Row 3: GALAXY (indices 11 to 16)
  [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
  // Inter-row connections
  [0, 7],   // W - T
  [2, 8],   // L - O
  [4, 9],   // O - M
  [6, 10],  // E - Y
  [7, 11],  // T - G
  [8, 12],  // O - A
  [9, 14],  // M - A
  [10, 16], // Y - Y
  [3, 8],   // C - O
  [8, 13],  // O - L
  [9, 13]   // M - L
];

const starryStyles = [
  { shadowColor: "rgba(255, 255, 255, 0.95)" },     // Pure White Star Glow
  { shadowColor: "rgba(241, 245, 249, 0.85)" },    // Soft Silver Glow
  { shadowColor: "rgba(226, 232, 240, 0.8)" },     // Delicate Slate Glow
  { shadowColor: "rgba(203, 213, 225, 0.75)" }     // Faint Starlight Glow
];

const targetCoords = [
  // Row 1: WELCOME
  { char: 'W', targetX: 96, targetY: 140 },
  { char: 'E', targetX: 124, targetY: 140 },
  { char: 'L', targetX: 152, targetY: 140 },
  { char: 'C', targetX: 180, targetY: 140 },
  { char: 'O', targetX: 208, targetY: 140 },
  { char: 'M', targetX: 236, targetY: 140 },
  { char: 'E', targetX: 264, targetY: 140 },
  // Row 2: TO MY
  { char: 'T', targetX: 128, targetY: 195 },
  { char: 'O', targetX: 156, targetY: 195 },
  { char: 'M', targetX: 204, targetY: 195 },
  { char: 'Y', targetX: 232, targetY: 195 },
  // Row 3: GALAXY
  { char: 'G', targetX: 110, targetY: 250 },
  { char: 'A', targetX: 138, targetY: 250 },
  { char: 'L', targetX: 166, targetY: 250 },
  { char: 'A', targetX: 194, targetY: 250 },
  { char: 'X', targetX: 222, targetY: 250 },
  { char: 'Y', targetX: 250, targetY: 250 }
];

const getRandomScatteredNodes = () => targetCoords.map((tc) => ({
  char: tc.char,
  x: 40 + Math.random() * 280,
  y: 50 + Math.random() * 300,
  vx: (Math.random() - 0.5) * 2,
  vy: (Math.random() - 0.5) * 2,
  rot: (Math.random() - 0.5) * 45,
  vrot: (Math.random() - 0.5) * 1.5,
  targetX: tc.targetX,
  targetY: tc.targetY
}));

const getTargetCoordsNodes = () => targetCoords.map((tc) => ({
  char: tc.char,
  x: tc.targetX,
  y: tc.targetY,
  vx: 0,
  vy: 0,
  rot: 0,
  vrot: 0,
  targetX: tc.targetX,
  targetY: tc.targetY
}));

export default function About() {
  const [about, setAbout] = useState(null);
  const [isScattered, setIsScattered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [stage, setStage] = useState("BUILDING");
  const [loopCounter, setLoopCounter] = useState(0);
  const [nodes, setNodes] = useState(() => getTargetCoordsNodes());
  const [inView, setInView] = useState(false);

  const sectionRef = useRef(null);
  const galaxyCanvasRef = useRef(null);
  const starsRef = useRef([]);
  const nodesRef = useRef(nodes);
  const isScatteredRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0, active: false });
  const timersRef = useRef([]);

  // Generate galaxy stars once
  useEffect(() => {
    const GALAXY_STARS = 220;
    const tempStars = [];
    for (let i = 0; i < GALAXY_STARS; i++) {
      const r = Math.pow(Math.random(), 1.5) * 150;
      const arm = Math.random() < 0.5 ? 0 : 1;
      const spiralFactor = 0.035;
      const angle = r * spiralFactor + arm * Math.PI + (Math.random() - 0.5) * 0.45;
      const speed = (0.008 + Math.random() * 0.004) * (30 / (r + 15));
      const size = Math.random() * 1.5 + 0.6;
      const opacity = Math.random() * 0.4 + 0.6;
      const randColor = Math.random();
      let color = "rgba(255, 255, 255, ";
      if (randColor < 0.3) {
        color = "rgba(165, 243, 252, ";
      } else if (randColor < 0.5) {
        color = "rgba(216, 180, 254, ";
      }
      tempStars.push({ r, angle, speed, size, opacity, color });
    }
    starsRef.current = tempStars;
  }, []);

  // Galaxy Canvas animation loop (only runs when component is in view)
  useEffect(() => {
    if (!inView) return;

    let animationFrameId;
    const canvas = galaxyCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = 360;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    const cx = width / 2;
    const cy = height / 2;
    const tiltFactor = 0.45;

    const renderGalaxy = () => {
      ctx.clearRect(0, 0, width, height);

      // Core glow gradient
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 45);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
      grad.addColorStop(0.3, "rgba(165, 243, 252, 0.2)");
      grad.addColorStop(0.7, "rgba(216, 180, 254, 0.08)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 55, 55 * tiltFactor, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Draw stars
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.angle += star.speed;

        const x = cx + star.r * Math.cos(star.angle);
        const y = cy + star.r * Math.sin(star.angle) * tiltFactor;

        const pulse = Math.sin(Date.now() * 0.005 + star.r) * 0.15;
        const currentOpacity = Math.max(0.2, Math.min(1, star.opacity + pulse));

        ctx.fillStyle = star.color + currentOpacity + ")";
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, 2 * Math.PI);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(renderGalaxy);
    };

    animationFrameId = requestAnimationFrame(renderGalaxy);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [inView]);

  // Sync state with mutable refs to keep the animation frame loop up-to-date
  useEffect(() => {
    isScatteredRef.current = isScattered;
  }, [isScattered]);

  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos]);

  useEffect(() => {
    api.get("/about").then((res) => setAbout(res.data)).catch(() => setAbout({}));
  }, []);

  // Sync loop/hover states to physics ref
  useEffect(() => {
    isScatteredRef.current = isHovered || (stage !== "STABILIZED");
  }, [isHovered, stage]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const startAnimation = () => {
    clearTimers();
    setLoopCounter(prev => prev + 1);
    setStage("STABILIZED");
    setIsScattered(false);

    nodesRef.current = getTargetCoordsNodes();
    setNodes(nodesRef.current);

    const timer = setTimeout(() => {
      setStage("GALAXY_ONLY");
    }, 3000);
    timersRef.current.push(timer);
  };

  // IntersectionObserver for scroll-reset tracking
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, []);

  // Control timeline based on inView and isHovered states
  useEffect(() => {
    if (isHovered) {
      setStage("STABILIZED");
      setIsScattered(true);
      return;
    }

    if (!inView) {
      clearTimers();
      setStage("BUILDING");
      setIsScattered(false);
      nodesRef.current = getTargetCoordsNodes();
      setNodes(nodesRef.current);
      return;
    }

    startAnimation();

    return () => {
      clearTimers();
    };
  }, [inView, isHovered]);

  // Floating background micro-particles
  const [particles] = useState(() => Array.from({ length: 15 }).map((_, idx) => ({
    id: idx,
    size: Math.random() * 3 + 1,
    left: `${Math.random() * 90 + 5}%`,
    top: `${Math.random() * 90 + 5}%`,
    delay: Math.random() * 4,
    duration: Math.random() * 5 + 4,
  })));

  // Physics animation loop
  useEffect(() => {
    let animationFrameId;

    const updatePhysics = () => {
      const currentNodes = nodesRef.current;
      const width = 360;
      const height = 400;
      const pad = 25;
      const activeScatter = isScatteredRef.current;
      const mouse = mousePosRef.current;

      // 1. Calculate & accumulate forces
      for (let i = 0; i < currentNodes.length; i++) {
        const node = currentNodes[i];
        let fx = 0;
        let fy = 0;

        if (!activeScatter) {
          // Assembled state: Spring attraction to target position
          const kSpring = 0.12;
          fx += -kSpring * (node.x - node.targetX);
          fy += -kSpring * (node.y - node.targetY);

          // Spring rotation pull back to 0
          const kRot = 0.12;
          const frot = -kRot * node.rot;
          node.vrot = (node.vrot + frot) * 0.8;
          node.rot += node.vrot;
        } else {
          // Scattered state: Organic float and drift (like pets)
          // A) Organic orbital/wave movement (smooth and fluid like Lottie animations)
          const time = Date.now() * 0.0012;
          fx += Math.sin(time + i * 1.5) * 0.35;
          fy += Math.cos(time * 0.8 + i * 1.5) * 0.35;

          // B) Keep slightly attracted to central band so they don't wander off
          const kCenter = 0.002;
          fx += -kCenter * (node.x - node.targetX);
          fy += -kCenter * (node.y - 200);

          // Organic rotation drift
          node.vrot += (Math.random() - 0.5) * 0.1;
          node.vrot *= 0.95;
          node.rot += node.vrot;

          // C) Repulsion from mouse cursor
          if (mouse.active) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const repelRadius = 120;
            if (dist < repelRadius) {
              const force = (repelRadius - dist) * 0.25;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
              
              // Torque impulse from mouse interaction
              node.vrot += (dx * node.vy - dy * node.vx) * 0.0015;
            }
          }
        }

        // Apply forces to velocity
        node.vx += fx;
        node.vy += fy;

        // Apply damping
        const damping = activeScatter ? 0.94 : 0.80;
        node.vx *= damping;
        node.vy *= damping;

        // Limit maximum velocity in scattered mode
        if (activeScatter) {
          const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy) || 1;
          const maxSpeed = 5;
          if (speed > maxSpeed) {
            node.vx = (node.vx / speed) * maxSpeed;
            node.vy = (node.vy / speed) * maxSpeed;
          }
        }
      }

      // 2. Resolve connections and spacing in scattered state
      if (activeScatter) {
        const restLength = 95;
        const webK = 0.035;

        for (let c = 0; c < connections.length; c++) {
          const [i, j] = connections[c];
          const ni = currentNodes[i];
          const nj = currentNodes[j];
          const dx = nj.x - ni.x;
          const dy = nj.y - ni.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const diff = dist - restLength;

          // Spring constraint
          const fx = (dx / dist) * diff * webK;
          const fy = (dy / dist) * diff * webK;

          ni.vx += fx;
          ni.vy += fy;
          nj.vx -= fx;
          nj.vy -= fy;
        }

        // Letter-to-letter overlapping repulsion
        const minDist = 48;
        const overlapK = 0.12;
        for (let i = 0; i < currentNodes.length; i++) {
          for (let j = i + 1; j < currentNodes.length; j++) {
            const ni = currentNodes[i];
            const nj = currentNodes[j];
            const dx = nj.x - ni.x;
            const dy = nj.y - ni.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < minDist) {
              const push = (minDist - dist) * overlapK;
              const px = (dx / dist) * push;
              const py = (dy / dist) * push;
              ni.vx -= px;
              ni.vy -= py;
              nj.vx += px;
              nj.vy += py;
            }
          }
        }
      }

      // 3. Move nodes and handle container boundaries
      for (let i = 0; i < currentNodes.length; i++) {
        const node = currentNodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // X boundaries
        if (node.x < pad) {
          node.x = pad;
          node.vx = Math.abs(node.vx) * 0.6;
        } else if (node.x > width - pad) {
          node.x = width - pad;
          node.vx = -Math.abs(node.vx) * 0.6;
        }

        // Y boundaries
        if (node.y < pad) {
          node.y = pad;
          node.vy = Math.abs(node.vy) * 0.6;
        } else if (node.y > height - pad) {
          node.y = height - pad;
          node.vy = -Math.abs(node.vy) * 0.6;
        }
      }

      // Sync coordinate updates to React state
      setNodes(currentNodes.map(n => ({ char: n.char, x: n.x, y: n.y, rot: n.rot })));

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, active: true });
    setIsHovered(true);
    setIsScattered(true);
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0, active: false });
    setIsHovered(false);
    setIsScattered(false);
  };

  return (
    <section id="about" ref={sectionRef} className="section-pad bg-transparent">
      <div className="container-xl relative z-10">
        <SectionTitle label="About" title="A Little About Me" />
        <div className="grid items-center gap-[60px] md:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }} 
            whileInView={{ opacity: 1, scale: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[360px] h-[400px] flex items-center justify-center group"
          >
            {/* Holographic Radial Glow Behind */}
            <motion.div 
              animate={{ 
                opacity: isHovered ? 0.7 : 0.35,
                scale: isHovered ? 1.05 : 0.95 
              }}
              transition={{ duration: 0.3 }}
              className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-white/15 via-slate-400/5 to-transparent blur-[45px] opacity-40 group-hover:opacity-80 transition-all duration-500 pointer-events-none" 
            />
            
            {/* Backgroundless Interactive Area */}
            <div
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => {
                setIsScattered(true);
                setIsHovered(true);
              }}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full rounded-[24px] bg-transparent overflow-hidden cursor-pointer select-none"
            >
              {/* Swirling Milky Way Galaxy Canvas */}
              <canvas
                ref={galaxyCanvasRef}
                className="absolute inset-0 pointer-events-none w-full h-full transition-opacity duration-1000"
                style={{ opacity: stage === "GALAXY_ONLY" ? (isHovered ? 0.25 : 1) : 0 }}
              />

              {/* Floating Background Micro-particles */}
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full bg-white/25"
                  style={{
                    width: p.size,
                    height: p.size,
                    left: p.left,
                    top: p.top,
                  }}
                  animate={{
                    y: [0, -80],
                    opacity: [0, 0.7, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Holographic Laptop Outline & Morphing SVG Layer */}
              <svg key={loopCounter} className="absolute inset-0 pointer-events-none w-full h-full">
                <defs>
                  <linearGradient id="laser-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#f1f5f9" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.55" />
                  </linearGradient>
                  <filter id="neon-glow-line" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Laser web connections - visible ONLY when HIRE ME is stabilized or hovered */}
                {connections.map(([i, j], idx) => {
                  const ni = nodes[i];
                  const nj = nodes[j];
                  if (!ni || !nj) return null;
                  const activeScatter = isHovered || (stage !== "STABILIZED");
                  return (
                    <line
                      key={idx}
                      x1={ni.x}
                      y1={ni.y}
                      x2={nj.x}
                      y2={nj.y}
                      stroke="url(#laser-glow)"
                      strokeWidth="2.5"
                      filter="url(#neon-glow-line)"
                      className="transition-opacity duration-700"
                      style={{
                        opacity: (activeScatter && (stage === "STABILIZED" || isHovered)) ? 0.45 : 0,
                      }}
                    />
                  );
                })}


              </svg>

              {/* Glowing Starlight Text Nodes */}
              {nodes.map((node, idx) => {
                const styleInfo = starryStyles[idx % starryStyles.length];
                
                // Delicate starlight breathing drift
                const time = Date.now() * 0.007;
                let scaleX = 1;
                let scaleY = 1;
                
                const activeScatter = isHovered || (stage !== "STABILIZED");
                if (activeScatter) {
                  const wave = Math.sin(time + idx * 1.0);
                  scaleX = 1.0 + wave * 0.04;
                  scaleY = 1.0 - wave * 0.04;
                } else {
                  const wave = Math.sin(Date.now() * 0.002 + idx * 0.8);
                  scaleX = 1.0 + wave * 0.02;
                  scaleY = 1.0 - wave * 0.02;
                }

                // Subtle float rotation
                const rotOffset = activeScatter ? Math.cos(time + idx * 1.0) * 3 : 0;
                const finalRot = (node.rot || 0) + rotOffset;

                // Fade letters in/out based on active states
                const lettersOpacity = isHovered ? 1 : (stage === "STABILIZED" ? 1 : 0);

                // Quick premium layout stagger delay when fading in
                const delaySec = isHovered ? 0 : (lettersOpacity === 1 ? (idx * 0.04) : 0);
                const durationSec = lettersOpacity === 1 ? 0.6 : 0.4;

                return (
                  <div
                    key={idx}
                    className="absolute select-none"
                    style={{
                      left: 0,
                      top: 0,
                      transform: `translate3d(${node.x}px, ${node.y}px, 0) translate(-50%, -50%) rotate(${finalRot}deg) scale(${scaleX}, ${scaleY})`,
                      zIndex: activeScatter ? 20 : 10,
                      opacity: lettersOpacity,
                      transition: `opacity ${durationSec}s cubic-bezier(0.16, 1, 0.3, 1) ${delaySec}s`
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span 
                        className="text-3xl md:text-4xl font-extrabold font-heading select-none text-white"
                        style={{
                          textShadow: `0 0 8px rgba(255, 255, 255, 0.95), 0 0 16px ${styleInfo.shadowColor}`,
                          fontFamily: "'Outfit', sans-serif"
                        }}
                      >
                        {node.char}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Subtext overlay - fades in when assembled */}
              <div 
                className={`absolute bottom-16 left-0 right-0 flex flex-col items-center gap-1.5 transition-all duration-700 pointer-events-none ${
                  (isHovered || stage === "STABILIZED") ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
                }`}
              >
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-slate-300 uppercase">
                  INITIATE CONTACT
                </span>
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Target guidelines - subtle circles in center when assembled */}
              <div 
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5 transition-opacity duration-700 pointer-events-none ${
                  (isHovered || stage === "STABILIZED") ? "opacity-100 animate-[spin_20s_linear_infinite]" : "opacity-0"
                }`}
              />
              <div 
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-dashed border-slate-500/5 transition-opacity duration-700 pointer-events-none ${
                  (isHovered || stage === "STABILIZED") ? "opacity-100 animate-[spin_30s_linear_infinite_reverse]" : "opacity-0"
                }`}
              />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[1.05rem] leading-8 text-gray-400">
              {about?.longDescription || about?.shortBio || "Update this section from the admin dashboard with Parampreet's story, education, strengths, and professional direction."}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {about?.achievements?.length > 0 ? about.achievements.map((ach) => (
                <div key={ach._id || ach.title} className="premium-card rounded-xl p-5 text-center group hover:border-cyan-500/50 flex flex-col items-center justify-center">
                  <div className="text-2xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] mb-2">
                    <IconRenderer iconName={ach.icon} size={28} className="text-cyan-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div className="text-xl font-extrabold text-white">{ach.number}</div>
                  <div className="mt-1 text-sm font-bold text-gray-300 group-hover:text-cyan-300 transition-colors">{ach.title}</div>
                </div>
              )) : (
                ["🎓 MCA Student", "💼 5+ Skills", "🚀 3+ Projects"].map((stat) => (
                  <div key={stat} className="premium-card rounded-xl p-5 text-center group hover:border-cyan-500/50">
                    <div className="text-2xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">{stat.split(" ")[0]}</div>
                    <div className="mt-2 text-sm font-bold text-gray-300 group-hover:text-cyan-300 transition-colors">{stat.substring(3)}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
