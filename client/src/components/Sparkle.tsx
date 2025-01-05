import { motion } from "framer-motion";

interface SparkleProps {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}

export function Sparkle({ color = "#FFF", size = 20, style }: SparkleProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, 1, 0],
        rotate: [0, 90, 180],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <path
        d="M80 0L88.1547 71.8453L160 80L88.1547 88.1547L80 160L71.8453 88.1547L0 80L71.8453 71.8453L80 0Z"
        fill={color}
      />
    </motion.svg>
  );
}

interface SparkleGroupProps {
  x: number;
  y: number;
}

export function SparkleGroup({ x, y }: SparkleGroupProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {[...Array(3)].map((_, i) => (
        <Sparkle
          key={i}
          style={{
            position: 'absolute',
            left: Math.random() * 40 - 20,
            top: Math.random() * 40 - 20,
          }}
          size={15 + Math.random() * 10}
          color={`hsla(${Math.random() * 60 + 50}, 100%, 75%, ${0.7 + Math.random() * 0.3})`}
        />
      ))}
    </div>
  );
}
