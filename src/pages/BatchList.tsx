import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import BatchTable from "../components/batch/BatchTable";
import BatchUploadModal from "../components/batch/BatchUploadModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Batch } from "../types/batch";
import api from "../utils/api";

const BatchList = () => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(
    new Set()
  );

  const isAdmin = user?.role === "admin";

  const { data: batches, isLoading } = useQuery<Batch[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      const { data } = await api.get("/batches");
      return data;
    },
  });

  const handleUpload = async (formData: FormData) => {
    try {
      await api.post("/batches/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Batch data uploaded successfully");
      setShowUploadModal(false);
    } catch (error) {
      toast.error("Failed to upload batch data");
      throw error;
    }
  };

  const toggleBatchExpansion = (batchId: string) => {
    const newExpanded = new Set(expandedBatches);
    if (newExpanded.has(batchId)) {
      newExpanded.delete(batchId);
    } else {
      newExpanded.add(batchId);
    }
    setExpandedBatches(newExpanded);
  };

  // Sort batches by year in descending order
  const sortedBatches = batches?.sort((a, b) => b.year - a.year) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Batch List</h1>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUploadModal(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Batch
            </motion.button>
          )}
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {sortedBatches.map((batch) => {
            const isExpanded = expandedBatches.has(batch._id);
            const filteredStudents = batch.students.filter((student) =>
              student.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (searchTerm && filteredStudents.length === 0) return null;

            return (
              <motion.div
                key={batch._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleBatchExpansion(batch._id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {batch.title} ({batch.year})
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {filteredStudents.length} Students
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-400 transform transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <BatchTable
                      students={filteredStudents}
                      isAdmin={isAdmin}
                      onEdit={(student) => {
                        // Handle edit
                        console.log("Edit student:", student);
                      }}
                      onDelete={(student) => {
                        // Handle delete
                        console.log("Delete student:", student);
                      }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {showUploadModal && (
          <BatchUploadModal
            onClose={() => setShowUploadModal(false)}
            onSubmit={handleUpload}
          />
        )}
      </div>
    </div>
  );
};

export default BatchList;
