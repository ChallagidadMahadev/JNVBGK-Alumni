import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../utils/api";
import ProfilePictureUpload from "../components/settings/ProfilePictureUpload";
import PhoneNumberInput from "../components/settings/PhoneNumberInput";
import OccupationFields from "../components/settings/OccupationFields";
import ParticipationFields from "../components/settings/ParticipationFields";
import { HOUSE_COLORS } from "../types/constants";

const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [profilePreview, setProfilePreview] = useState<string | null>(
    user?.profilePicture || null
  );
  const [showPhoneNumber, setShowPhoneNumber] = useState(
    user?.showPhoneNumber || false
  );

  useEffect(() => {
    if (user?.showPhoneNumber !== undefined) {
      setShowPhoneNumber(user.showPhoneNumber);
    }
  }, [user?.showPhoneNumber]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      gender: user?.gender || "",
      house: user?.house || "",
      occupation: user?.occupation || "",
      occupationSubField: user?.occupationSubField || "",
      participation: user?.participation || [],
      customParticipation: user?.customParticipation || "",
      batchYear: user?.batchYear || "",
      showPhoneNumber: user?.showPhoneNumber || false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // Add all form fields except showPhoneNumber
      Object.keys(data).forEach((key) => {
        if (
          key !== "showPhoneNumber" &&
          data[key] !== undefined &&
          data[key] !== ""
        ) {
          if (key === "participation" && Array.isArray(data[key])) {
            data[key]
              .filter((value: string) => value !== "Others")
              .forEach((value: string) => {
                formData.append("participation[]", value);
              });
          } else if (key === "occupationSubField" && data[key] === "Others") {
            return;
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      // Add showPhoneNumber from state
      formData.append("showPhoneNumber", showPhoneNumber.toString());

      if (profilePreview && profilePreview !== user?.profilePicture) {
        formData.append("profilePicture", profilePreview);
      }

      const updatedUser = await updateProfile(formData);
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      navigate("/alumni");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your profile information and privacy settings
        </p>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <ProfilePictureUpload
              currentImage={profilePreview}
              gender={watch("gender")}
              onImageChange={handleImageChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.01 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message?.toString()}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Batch Year
                  </label>
                  <input
                    type="number"
                    {...register("batchYear", {
                      required: "Batch year is required",
                      min: {
                        value: 1980,
                        message: "Batch year must be 1980 or later",
                      },
                      max: {
                        value: new Date().getFullYear(),
                        message: "Invalid batch year",
                      },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.batchYear && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.batchYear.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="flex space-x-4">
                    {["male", "female"].map((gender) => (
                      <label key={gender} className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register("gender", {
                            required: "Please select your gender",
                          })}
                          value={gender}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2 capitalize">{gender}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.gender.message?.toString()}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            <PhoneNumberInput
              register={register}
              errors={errors}
              showPhoneNumber={showPhoneNumber}
              setShowPhoneNumber={setShowPhoneNumber}
            />

            <motion.div whileHover={{ scale: 1.01 }} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                House
              </label>
              <select
                {...register("house")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select House</option>
                {Object.entries(HOUSE_COLORS).map(([house, color]) => (
                  <option key={house} value={house}>
                    {house}
                  </option>
                ))}
              </select>
            </motion.div>

            <OccupationFields
              register={register}
              watch={watch}
              errors={errors}
            />

            <ParticipationFields
              register={register}
              watch={watch}
              errors={errors}
            />

            <motion.div
              className="flex justify-end"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  ${
                    isSubmitting
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                  text-white px-6 py-3 rounded-lg font-medium shadow-lg
                  transform transition-all duration-300
                  ${
                    isSubmitting ? "cursor-not-allowed" : "hover:-translate-y-1"
                  }
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving Changes...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
