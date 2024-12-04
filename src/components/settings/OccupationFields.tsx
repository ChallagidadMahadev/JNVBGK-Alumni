import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { OCCUPATIONS, OCCUPATION_SUBFIELDS } from "../../types/constants";

interface OccupationFieldsProps {
  register: any;
  watch: any;
  errors: any;
}

const OccupationFields: React.FC<OccupationFieldsProps> = ({
  register,
  watch,
  errors,
}) => {
  const selectedOccupation = watch("occupation");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Occupation
        </label>
        <div className="relative mt-1">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <motion.select
            {...register("occupation")}
            whileFocus={{ scale: 1.01 }}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Occupation</option>
            {OCCUPATIONS.map((occupation) => (
              <option key={occupation} value={occupation}>
                {occupation}
              </option>
            ))}
          </motion.select>
        </div>
      </div>

      {selectedOccupation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700">
            Sub Field
          </label>
          <div className="mt-1">
            {selectedOccupation === "Others" ? (
              <motion.input
                {...register("occupationSubField")}
                whileFocus={{ scale: 1.01 }}
                placeholder="Please specify"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <motion.select
                {...register("occupationSubField")}
                whileFocus={{ scale: 1.01 }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Sub Field</option>
                {OCCUPATION_SUBFIELDS[
                  selectedOccupation as keyof typeof OCCUPATION_SUBFIELDS
                ]?.map((subField) => (
                  <option key={subField} value={subField}>
                    {subField}
                  </option>
                ))}
              </motion.select>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OccupationFields;
