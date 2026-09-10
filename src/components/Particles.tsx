import React, { useEffect, useState } from 'react';

const Particles: React.FC = () => {
  const [dots, setDots] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random particles
    const newDots = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface/40 via-background to-background"></div>
      
      {/* Subtle red glow accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

      {/* Noise texture overlay */}
      <div className="bg-noise"></div>

      {/* Floating particles */}
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-white/20 blur-[1px]"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            animation: `float ${dot.duration}s ease-in-out infinite alternate`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
