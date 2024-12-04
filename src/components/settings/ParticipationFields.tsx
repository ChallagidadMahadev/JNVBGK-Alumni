import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { PARTICIPATION_CATEGORIES } from "../../types/constants";

interface ParticipationFieldsProps {
  register: any;
  watch: any;
  errors: any;
}

const ParticipationFields: React.FC<ParticipationFieldsProps> = ({
  register,
  watch,
  errors,
}) => {
  const selectedParticipation = watch("participation") || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Participation
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PARTICIPATION_CATEGORIES.map((category) => (
            <motion.label
              key={category}
              className="inline-flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="checkbox"
                {...register("participation")}
                value={category}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">{category}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {selectedParticipation.includes("Others") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <input
            {...register("customParticipation")}
            placeholder="Please specify other areas"
            className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </motion.div>
      )}
    </div>
  );
};

export default ParticipationFields;
