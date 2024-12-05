import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Event } from "../../types";
import LoadingSpinner from "../common/LoadingSpinner";

interface ParticipationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (attending: boolean) => Promise<void>;
  isSubmitting: boolean;
}

const ParticipationModal: React.FC<ParticipationModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<boolean | null>(
    null
  );

  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", duration: 0.5 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Will you attend {event.title}?
                </h3>

                <p className="text-gray-600 mb-6">
                  Please confirm your participation for the event on{" "}
                  {new Date(event.startDate).toLocaleDateString()}
                </p>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedOption(true)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedOption === true
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-200"
                    }`}
                  >
                    <span className="text-3xl mb-2">😊</span>
                    <p className="font-medium text-gray-900">
                      Yes, I'll be there!
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedOption(false)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedOption === false
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <span className="text-3xl mb-2">😢</span>
                    <p className="font-medium text-gray-900">
                      Sorry, can't make it
                    </p>
                  </motion.button>
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={selectedOption !== null ? { scale: 1.02 } : {}}
                  whileTap={selectedOption !== null ? { scale: 0.98 } : {}}
                  onClick={() =>
                    selectedOption !== null && onConfirm(selectedOption)
                  }
                  disabled={isSubmitting || selectedOption === null}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                    selectedOption === null
                      ? "bg-gray-400 cursor-not-allowed"
                      : selectedOption
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      <span>Confirming...</span>
                    </div>
                  ) : (
                    "Confirm Response"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ParticipationModal;
