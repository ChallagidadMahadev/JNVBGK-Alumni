import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFaculty } from "../hooks/useFaculty";
import FacultyTable from "../components/faculty/FacultyTable";
import FacultyForm from "../components/faculty/FacultyForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Faculty as FacultyType } from "../types/faculty";

const Faculty = () => {
  const { user } = useAuth();
  const { faculty, isLoading, createFaculty, updateFaculty, deleteFaculty } =
    useFaculty();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyType | null>(
    null
  );

  const isAdmin = user?.role === "admin";

  const filteredFaculty = faculty.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.location &&
        member.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (
    data: Omit<FacultyType, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (selectedFaculty) {
        await updateFaculty({ id: selectedFaculty.id, data });
      } else {
        await createFaculty(data);
      }
      setShowForm(false);
      setSelectedFaculty(null);
    } catch (error) {
      console.error("Failed to save faculty member:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Faculty</h1>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Faculty
            </motion.button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty by name or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {filteredFaculty.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Faculty Found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search"
                : "No faculty members have been added yet"}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FacultyTable
              faculty={filteredFaculty}
              onEdit={
                isAdmin
                  ? (faculty) => {
                      setSelectedFaculty(faculty);
                      setShowForm(true);
                    }
                  : undefined
              }
              onDelete={
                isAdmin
                  ? (id) => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this faculty member?"
                        )
                      ) {
                        deleteFaculty(id);
                      }
                    }
                  : undefined
              }
            />
          </motion.div>
        )}

        {showForm && (
          <FacultyForm
            initialData={selectedFaculty}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setSelectedFaculty(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Faculty;
