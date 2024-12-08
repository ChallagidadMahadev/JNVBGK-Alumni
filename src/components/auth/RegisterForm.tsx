import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { register as registerUser } from "../../utils/api";
import LoadingSpinner from "../common/LoadingSpinner";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const getBatchNumber = (year: number) => {
    const startYear = 2008; // First batch year
    return year >= startYear ? year - startYear + 1 : null;
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await registerUser({
        ...data,
        gender: data.gender || "male",
      });
      toast.success(`Welcome ${data.name}! Please login to continue.`);
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="batchYear"
              className="block text-sm font-medium text-gray-700"
            >
              Batch Year
            </label>
            <select
              {...register("batchYear", { required: "Batch year is required" })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select your batch year</option>
              {Array.from({ length: 30 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                const batchNumber = getBatchNumber(year);
                return year >= 2008 ? (
                  <option key={year} value={year}>
                    {year}{" "}
                    {batchNumber
                      ? `(${batchNumber}${getOrdinalSuffix(batchNumber)} Batch)`
                      : ""}
                  </option>
                ) : null;
              }).filter(Boolean)}
            </select>
            {errors.batchYear && (
              <p className="mt-1 text-sm text-red-600">
                {errors.batchYear.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  {...register("gender", { required: "Gender is required" })}
                  type="radio"
                  value="male"
                  className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  {...register("gender", { required: "Gender is required" })}
                  type="radio"
                  value="female"
                  className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Female</span>
              </label>
            </div>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">
                {errors.gender.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to add ordinal suffix to numbers (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (n: number): string => {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

export default RegisterForm;
