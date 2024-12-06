import React from "react";
import { motion } from "framer-motion";
import { X, Phone, Mail, MapPin, Briefcase, Award } from "lucide-react";
import { Alumni, HOUSE_COLORS } from "../../types";
import { useAuth } from "../../context/AuthContext";
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
  const { isAuthenticated } = useAuth();

  const getDefaultProfilePicture = () => {
    return alumni.gender === "female" ? femaleProfileSvg : maleProfileSvg;
  };

  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return "";
    if (!isAuthenticated) return "**********";
    return alumni.showPhoneNumber ? phone : "**********";
  };

  const houseColor = alumni.house
    ? HOUSE_COLORS[alumni.house as keyof typeof HOUSE_COLORS]
    : "gray";
  const prefix = alumni.gender === "female" ? "Ms." : "Mr.";

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <img
                  src={alumni.profilePicture || getDefaultProfilePicture()}
                  alt={alumni.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              </div>
            </div>

            <div className="pt-20 px-6 pb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {prefix} {alumni.name}
                </h2>
                <p className="text-gray-600">Batch of {alumni.batchYear}</p>
                {alumni.house && (
                  <span
                    className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `rgba(${houseColor}, 0.1)`,
                      color: `rgb(${houseColor})`,
                    }}
                  >
                    {alumni.house} House
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alumni.phoneNumber && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">
                        {formatPhoneNumber(alumni.phoneNumber)}
                        {(!isAuthenticated || !alumni.showPhoneNumber) && (
                          <span className="text-xs text-gray-500 ml-2">
                            {!isAuthenticated ? "(Login to view)" : "(Private)"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{alumni.email}</p>
                  </div>
                </div>

                {alumni.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-gray-900">{alumni.address}</p>
                    </div>
                  </div>
                )}

                {alumni.occupation && (
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Occupation
                      </p>
                      <p className="text-gray-900">
                        {alumni.occupation}
                        {alumni.occupationSubField &&
                          alumni.occupationSubField !== "Others" && (
                            <span className="text-gray-600">
                              {" "}
                              - {alumni.occupationSubField}
                            </span>
                          )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {alumni.participation && alumni.participation.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-medium text-gray-500">
                      Areas of Participation
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alumni.participation
                      .filter((p) => p !== "Others")
                      .map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    {alumni.customParticipation && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {alumni.customParticipation}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AlumniProfileModal;
