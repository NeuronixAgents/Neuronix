import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

function generateParticle(id: number): Particle {
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2, // Increased size range
    duration: Math.random() * 15 + 20, // Slower movement
  };
}

export function CircuitBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const maxParticles = 30; // Reduced for better performance

  const addParticle = useCallback(() => {
    setParticles(current => {
      if (current.length >= maxParticles) return current;
      return [...current, generateParticle(Date.now())];
    });
  }, []);

  const removeParticle = useCallback((id: number) => {
    setParticles(current => current.filter(p => p.id !== id));
  }, []);

  useEffect(() => {
    const interval = setInterval(addParticle, 800); // Slower particle generation
    return () => clearInterval(interval);
  }, [addParticle]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="w-full h-full relative">
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{
                opacity: 0,
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                scale: 0,
              }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
                x: [`${particle.x}%`, `${particle.x + (Math.random() - 0.5) * 15}%`],
                y: [`${particle.y}%`, `${particle.y + (Math.random() - 0.5) * 15}%`],
                scale: [0, 1, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                ease: "easeInOut",
                times: [0, 0.2, 0.8, 1],
              }}
              onAnimationComplete={() => removeParticle(particle.id)}
              className="absolute"
              style={{
                width: particle.size * 8, // Increased particle size
                height: particle.size * 8,
              }}
            >
              <div
                className="w-full h-full rounded-full bg-white"
                style={{
                  boxShadow: `
                    0 0 ${particle.size * 4}px rgba(255, 255, 255, 0.9),
                    0 0 ${particle.size * 8}px rgba(255, 255, 255, 0.7),
                    0 0 ${particle.size * 12}px rgba(255, 255, 255, 0.5)
                  `,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}