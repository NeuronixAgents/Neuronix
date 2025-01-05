import { motion } from "framer-motion";

export function CircuitBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <motion.path
            id="wave"
            d="M 0 50 C 20 30, 40 70, 60 50 C 80 30, 100 70, 120 50"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              pathOffset: [0, 0.5, 1],
            }}
            transition={{
              duration: 5,
              times: [0, 0.5, 1],
              ease: "easeInOut",
              repeat: 0
            }}
          />
          <pattern 
            id="circuit" 
            x="0" 
            y="0" 
            width="120" 
            height="100" 
            patternUnits="userSpaceOnUse"
          >
            <motion.use 
              href="#wave" 
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
            <motion.circle 
              cx="60" 
              cy="50" 
              r="3" 
              fill="currentColor"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                times: [0, 0.5, 1],
                ease: "easeInOut",
                repeat: 0
              }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
}