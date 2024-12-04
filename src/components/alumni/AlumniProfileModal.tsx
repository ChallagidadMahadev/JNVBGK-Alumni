import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MapPin, Briefcase, Award, Home } from "lucide-react";
import { Alumni, HOUSE_COLORS, OCCUPATION_PREFIXES } from "../../types";
import { maleProfileSvg, femaleProfileSvg } from "../../utils/profileIcons";

interface AlumniProfileModalProps {
  alumni: Alumni;
  isOpen: boolean;
  onClose: () => void;
}

const AlumniProfileModal: React.FC<AlumniProfileModalProps> = ({
  alumni,
  isOpen,
  onClose,
}) => {
  const getDefaultProfilePicture = () => {
    return alumni.gender === "female" ? femaleProfileSvg : maleProfileSvg;
  };

  const houseColor = alumni.house
    ? HOUSE_COLORS[alumni.house as keyof typeof HOUSE_COLORS]
    : "gray";
  
    const prefix = alumni.gender === "female" ? "Ms." : "Mr.";


  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return "";
    return alumni.showPhoneNumber ? phone : "**********";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={onClose}
            />

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="absolute top-0 right-0 pt-4 pr-4 z-[70]">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex flex-col items-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                      >
                        <img
                          src={
                            alumni.profilePicture || getDefaultProfilePicture()
                          }
                          alt={alumni.name}
                          className="w-32 h-32 rounded-full object-cover ring-4"
                          style={{ borderColor: `var(--${houseColor}-500)` }}
                        />
                        {alumni.house && (
                          <span
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-4 border-white"
                            style={{
                              backgroundColor: `var(--${houseColor}-500)`,
                            }}
                          />
                        )}
                      </motion.div>
                      <h3 className="mt-4 text-2xl font-bold text-gray-900">
                        {prefix} {alumni.name}
                      </h3>
                      <p className="text-gray-600">
                        Batch of {alumni.batchYear}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {alumni.phoneNumber && (
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-400 mr-2" />
                          <span>{formatPhoneNumber(alumni.phoneNumber)}</span>
                          {!alumni.showPhoneNumber && (
                            <span className="ml-2 text-sm text-gray-500">
                              (Private)
                            </span>
                          )}
                        </div>
                      )}

                      {alumni.house && (
                        <div className="flex items-center">
                          <Home className="w-5 h-5 text-gray-400 mr-2" />
                          <span>{alumni.house} House</span>
                        </div>
                      )}

                      {alumni.occupation && alumni.occupation !== "Others" && (
                        <div className="flex items-center">
                          <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
                          <span>
                            {alumni.occupation}
                            {alumni.occupationSubField &&
                              alumni.occupationSubField !== "Others" &&
                              ` - ${alumni.occupationSubField}`}
                          </span>
                        </div>
                      )}

                      {alumni.participation &&
                        alumni.participation.length > 0 && (
                          <div className="flex items-start">
                            <Award className="w-5 h-5 text-gray-400 mr-2 mt-1" />
                            <div>
                              <span className="font-medium">
                                Areas of Participation:
                              </span>
                              <ul className="list-disc list-inside ml-4">
                                {alumni.participation
                                  .filter((area) => area !== "Others")
                                  .map((area) => (
                                    <li key={area}>{area}</li>
                                  ))}
                                {alumni.customParticipation && (
                                  <li>{alumni.customParticipation}</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AlumniProfileModal;
