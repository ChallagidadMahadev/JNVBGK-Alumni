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

  return (
    <div className={`relative ${containerSize} ${className}`}>
      {Object.entries(HOUSE_COLORS).map(([house, color], index) => {
        const angle = (index * Math.PI * 2) / 4;
        const radius = size === "sm" ? 12 : size === "lg" ? 24 : 16;

        return (
          <motion.div
            key={house}
            className={`absolute ${dotSize} rounded-full`}
            style={{
              backgroundColor: `rgb(${color})`,
              filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
              top: "50%",
              left: "50%",
              marginTop: `-${parseInt(dotSize) / 2}px`,
              marginLeft: `-${parseInt(dotSize) / 2}px`,
            }}
            animate={{
              x: [
                Math.cos(angle) * radius * 0.5,
                Math.cos(angle) * radius,
                Math.cos(angle) * radius * 0.5,
              ],
              y: [
                Math.sin(angle) * radius * 0.5,
                Math.sin(angle) * radius,
                Math.sin(angle) * radius * 0.5,
              ],
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              delay: index * 0.15,
            }}
          />
        );
      })}
    </div>
  );
};

export default LoadingSpinner;
