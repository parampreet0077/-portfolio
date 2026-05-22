import { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const isMobile = window.innerWidth < 768;
    const numStars = isMobile ? 150 : 400;
    
    // Star particles
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      velocity: (Math.random() * 0.5 + 0.1) * (Math.random() < 0.5 ? 1 : -1),
      twinkleSpeed: Math.random() * 0.03 + 0.01
    }));

    // Planets/Orbs
    const planets = [
      { x: canvas.width * 0.8, y: canvas.height * 0.2, radius: isMobile ? 60 : 120, color1: "#7c3aed", color2: "#ec4899", driftX: -0.05, driftY: 0.02 },
      { x: canvas.width * 0.1, y: canvas.height * 0.7, radius: isMobile ? 40 : 80, color1: "#06b6d4", color2: "#7c3aed", driftX: 0.03, driftY: -0.04 },
    ];

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.005;

      // Draw subtle rotating blackhole/nebula in center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width * 0.6);
      gradient.addColorStop(0, "rgba(10, 10, 15, 1)");
      gradient.addColorStop(0.5, "rgba(20, 10, 30, 0.4)");
      gradient.addColorStop(1, "rgba(10, 10, 15, 0.8)");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Planets
      planets.forEach(p => {
        p.x += p.driftX;
        p.y += p.driftY;
        
        // Wrap around screen
        if (p.x > canvas.width + p.radius) p.x = -p.radius;
        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.y > canvas.height + p.radius) p.y = -p.radius;
        if (p.y < -p.radius) p.y = canvas.height + p.radius;

        const pGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        pGradient.addColorStop(0, p.color1);
        pGradient.addColorStop(1, "transparent");
        
        ctx.globalAlpha = 0.4; // Soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = pGradient;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Draw Stars
      stars.forEach(star => {
        star.y += star.velocity;
        star.alpha += Math.sin(time * 10) * star.twinkleSpeed;
        
        if (star.alpha > 1) star.alpha = 1;
        if (star.alpha < 0) star.alpha = 0;
        
        if (star.y > canvas.height) star.y = 0;
        if (star.y < 0) star.y = canvas.height;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
