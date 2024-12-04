import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

interface PhoneNumberInputProps {
  register: any;
  errors: any;
  showPhoneNumber: boolean;
  setShowPhoneNumber: (show: boolean) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  register,
  errors,
  showPhoneNumber,
  setShowPhoneNumber,
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Phone Number & Privacy
      </label>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <motion.input
            {...register("phoneNumber", {
              pattern: {
                value: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
                message: "Please enter a valid Indian phone number",
              },
            })}
            whileFocus={{ scale: 1.01 }}
            placeholder="+91 XXXXX XXXXX"
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showPhoneNumber}
              onChange={(e) => {
                setShowPhoneNumber(e.target.checked);
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700 whitespace-nowrap">
              Show phone number to others
            </span>
          </label>
        </div>
      </div>
      {errors.phoneNumber && (
        <p className="text-sm text-red-600 mt-1">
          {errors.phoneNumber.message}
        </p>
      )}
      <p className="text-sm text-gray-500 mt-2">
        {showPhoneNumber
          ? "Your phone number will be visible to other alumni"
          : "Your phone number will be hidden from other alumni"}
      </p>
    </div>
  );
};

export default PhoneNumberInput;
