import React from "react";
import { motion } from "framer-motion";
import { Alumni, HOUSE_COLORS } from "../../types";
import { maleProfileSvg, femaleProfileSvg } from "../../utils/profileIcons";

interface AlumniCardProps {
  person: Alumni;
  onClick: () => void;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ person, onClick }) => {
  const getDefaultProfilePicture = () => {
    return person.gender === "female" ? femaleProfileSvg : maleProfileSvg;
  };

  const getHouseColor = () => {
    if (!person.house) return "#FFF";
    switch (person.house) {
      case "ARAVALI":
        return "rgb(59, 130, 246)"; // blue-500
      case "NILGIRI":
        return "rgb(34, 197, 94)"; // green-500
      case "SHIVALIK":
        return "rgb(239, 68, 68)"; // red-500
      case "UDAYAGIRI":
        return "rgb(234, 179, 8)"; // yellow-500
      default:
        return "FFF";
    }
  };

  const houseColor = person.house
    ? HOUSE_COLORS[person.house as keyof typeof HOUSE_COLORS]
    : "gray";
  const prefix = person.gender === "female" ? "Ms." : "Mr.";

  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return "";
    return person.showPhoneNumber ? phone : "**********";
  };

  const getHouseLetter = () => {
    if (!person.house) return null;
    return person.house.charAt(0);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 relative"
      onClick={onClick}
    >
      {/* House Letter Badge */}
      {person.house && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 left-3 z-10"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center transform -rotate-12"
            style={{
              backgroundColor: getHouseColor(),
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span
              className="text-white font-bold text-xl transform rotate-12"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
            >
              {getHouseLetter()}
            </span>
          </div>
        </motion.div>
      )}

      <div className="p-6">
        <div className="relative">
          <motion.img
            src={person.profilePicture || getDefaultProfilePicture()}
            alt={person.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4"
            style={{ borderColor: getHouseColor() || "rgb(209, 213, 219)" }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
            {prefix} {person.name}
          </h3>
          <p className="text-gray-600 text-center mb-2">
            Batch of {person.batchYear}
          </p>
          {person.occupation && person.occupation !== "Others" && (
            <p className="text-gray-600 text-center text-sm mb-2">
              {person.occupation}
              {person.occupationSubField &&
                person.occupationSubField !== "Others" &&
                ` - ${person.occupationSubField}`}
            </p>
          )}
          {person.phoneNumber && (
            <p className="text-gray-600 text-center text-sm mb-2">
              📞 {formatPhoneNumber(person.phoneNumber)}
              {!person.showPhoneNumber && (
                <span className="text-xs text-gray-500 ml-1">(Private)</span>
              )}
            </p>
          )}
        </motion.div>

        <motion.div className="border-t pt-4 mt-4" whileHover={{ scale: 1.05 }}>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            View Profile
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AlumniCard;
