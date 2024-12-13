import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X, Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "react-hot-toast";
import { BatchUploadProps, BatchStudent } from "../../types/batch";
import { validateBatchFile } from "../../services/batchService";
import { parseCSV, parseExcel, parseTXT } from "../../services/fileParser";
import LoadingSpinner from "../common/LoadingSpinner";

const allowedFileTypes = {
  "text/csv": "CSV",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "application/vnd.ms-excel": "Excel",
  "text/plain": "TXT",
};

const BatchUploadModal: React.FC<BatchUploadProps> = ({
  onClose,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<BatchStudent[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      e.target.value = "";
      return;
    }

    const fileType = file.type;
    if (!Object.keys(allowedFileTypes).includes(fileType)) {
      toast.error("Please upload a CSV, Excel, or TXT file");
      e.target.value = "";
      return;
    }

    try {
      const isValid = await validateBatchFile(file);
      if (!isValid) {
        toast.error(
          "Invalid file format or content. File must contain at least a name column."
        );
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      let preview: BatchStudent[] = [];

      switch (fileType) {
        case "text/csv":
          preview = await parseCSV(file);
          break;
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
          preview = await parseExcel(file);
          break;
        case "text/plain":
          preview = await parseTXT(file);
          break;
      }

      setPreviewData(preview.slice(0, 5));
    } catch (error) {
      toast.error("Error reading file");
      e.target.value = "";
    }
  };

  const onFormSubmit = async (data: any) => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("batchNumber", data.batchNumber.toString());
    formData.append("title", data.title);
    formData.append("year", data.year.toString());

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error uploading batch:", error);
      toast.error("Failed to upload batch data");
    }
  };

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
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Upload Batch Data
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Batch Number
                  </label>
                  <input
                    type="number"
                    {...register("batchNumber", {
                      required: "Batch number is required",
                      min: {
                        value: 1,
                        message: "Batch number must be positive",
                      },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.batchNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.batchNumber.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Batch Title
                  </label>
                  <input
                    type="text"
                    {...register("title", {
                      required: "Batch title is required",
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., 5th Batch Students (2012-2019)"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="number"
                    {...register("year", {
                      required: "Year is required",
                      min: {
                        value: 2008,
                        message: "Year must be 2008 or later",
                      },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.year && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.year.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            accept=".csv,.xlsx,.xls,.txt"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV, Excel, or TXT file up to 5MB
                      </p>
                    </div>
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected file: {selectedFile.name}
                    </p>
                  )}
                </div>

                {previewData.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Preview (First 5 Records)
                    </h3>
                    <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Roll Number
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              House
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((student, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-200"
                            >
                              <td className="px-4 py-2 text-sm">
                                {student.name}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {student.rollNumber || "-"}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {student.house || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedFile}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        <span>Upload Batch</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BatchUploadModal;
