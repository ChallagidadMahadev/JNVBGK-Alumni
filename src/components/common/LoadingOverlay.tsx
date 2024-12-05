import React from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Loading...",
  fullScreen = false,
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50"
    : "absolute inset-0 z-10";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${containerClasses} flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm`}
    >
      <LoadingSpinner size="lg" />
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600 font-medium"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingOverlay;
