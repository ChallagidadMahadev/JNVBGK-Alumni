import React from "react";
import { motion } from "framer-motion";
import { HOUSE_COLORS } from "../../types/constants";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const getSize = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8";
      case "lg":
        return "w-16 h-16";
      default:
        return "w-12 h-12";
    }
  };

  const getDotSize = () => {
    switch (size) {
      case "sm":
        return "w-2 h-2";
      case "lg":
        return "w-4 h-4";
      default:
        return "w-3 h-3";
    }
  };

  const containerSize = getSize();
  const dotSize = getDotSize();

  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 1,
  };

  return (
    <div className={`relative ${containerSize} ${className}`}>
      {Object.entries(HOUSE_COLORS).map(([house, color], index) => (
        <motion.div
          key={house}
          className={`absolute ${dotSize} rounded-full`}
          style={{
            backgroundColor: `rgb${color}`,
            top: "50%",
            left: "50%",
            margin: "-4px 0 0 -4px",
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            x: [0, Math.cos((2 * Math.PI * index) / 4) * 20],
            y: [0, Math.sin((2 * Math.PI * index) / 4) * 20],
          }}
          transition={{
            ...spinTransition,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
