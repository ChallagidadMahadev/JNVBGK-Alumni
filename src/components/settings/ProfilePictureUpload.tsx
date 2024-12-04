import React from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { toast } from "react-hot-toast";
import { femaleProfileSvg, maleProfileSvg } from "../../utils/profileIcons";

interface ProfilePictureUploadProps {
  currentImage: string | null;
  gender: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  gender,
  onImageChange,
}) => {
  const getDefaultImage = () => {
    return gender === "female" ? femaleProfileSvg : maleProfileSvg;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      e.target.value = "";
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        "Image size should be less than 5MB. Using default image instead."
      );
      e.target.value = "";
      return;
    }

    // Check image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width > 2000 || img.height > 2000) {
        toast.error(
          "Image dimensions should be less than 2000x2000 pixels. Using default image instead."
        );
        e.target.value = "";
        return;
      }
      onImageChange(e);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      toast.error("Failed to load image. Using default image instead.");
      e.target.value = "";
    };
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="relative group"
        >
          <img
            src={currentImage || getDefaultImage()}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-100 transition-all duration-300 group-hover:ring-blue-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300" />
          <label
            htmlFor="profilePicture"
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-300 shadow-lg transform group-hover:scale-110"
          >
            <Camera className="w-5 h-5" />
          </label>
        </motion.div>
        <input
          id="profilePicture"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center"
      >
        <p className="text-sm text-gray-600 mb-1">
          Click the camera icon to update your profile picture
        </p>
        <p className="text-xs text-gray-500">
          Maximum size: 5MB • Recommended: 500x500px
        </p>
      </motion.div>
    </div>
  );
};

export default ProfilePictureUpload;
