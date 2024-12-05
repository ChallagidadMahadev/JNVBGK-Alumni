import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { getAlumni } from "../utils/api";
import { Alumni as AlumniType } from "../types";
import { toast } from "react-hot-toast";
import AlumniCard from "../components/alumni/AlumniCard";
import AlumniProfileModal from "../components/alumni/AlumniProfileModal";
import BatchSection from "../components/alumni/BatchSection";
import LoadingOverlay from "../components/common/LoadingOverlay";

const Alumni = () => {
  const [alumni, setAlumni] = useState<AlumniType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [selectedOccupation, setSelectedOccupation] = useState<string>("all");
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const data = await getAlumni();
        setAlumni(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching alumni:", err);
        setError("Failed to load alumni data");
        toast.error("Failed to load alumni data");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const handleAlumniClick = (person: AlumniType) => {
    setSelectedAlumni(person);
    setIsModalOpen(true);
  };

  // Group alumni by batch year
  const groupedAlumni = alumni.reduce((acc, person) => {
    if (!acc[person.batchYear]) {
      acc[person.batchYear] = [];
    }
    acc[person.batchYear].push(person);
    return acc;
  }, {} as Record<number, AlumniType[]>);

  // Get unique batch years and sort them in ascending order
  const batchYears = Object.keys(groupedAlumni)
    .map(Number)
    .sort((a, b) => a - b);

  // Get unique occupations
  const occupations = Array.from(
    new Set(alumni.map((a) => a.occupation).filter(Boolean))
  );

  // Filter alumni based on search, batch, and occupation
  const filteredAlumni = alumni.filter((person) => {
    const matchesSearch = person.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBatch =
      selectedBatch === "all" || person.batchYear.toString() === selectedBatch;
    const matchesOccupation =
      selectedOccupation === "all" || person.occupation === selectedOccupation;
    return matchesSearch && matchesBatch && matchesOccupation;
  });

  if (loading) {
    return <LoadingOverlay message="Loading alumni data..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Alumni Directory
          </h1>

          {/* Search and Filter Controls */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alumni..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 md:w-auto"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-sm"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch
                  </label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Batches</option>
                    {batchYears.map((year) => (
                      <option key={year} value={year}>
                        Batch {year - 2007} ({year})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <select
                    value={selectedOccupation}
                    onChange={(e) => setSelectedOccupation(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Occupations</option>
                    {occupations.map((occupation) => (
                      <option key={occupation} value={occupation}>
                        {occupation}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Alumni Sections */}
        {searchTerm ||
        selectedBatch !== "all" ||
        selectedOccupation !== "all" ? (
          // Show filtered results
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results
              </h2>
              <span className="text-gray-500">
                {filteredAlumni.length} alumni found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.length === 0 ? (
                <div className="col-span-full text-center text-gray-600 py-12">
                  <p>No alumni found matching your search criteria.</p>
                </div>
              ) : (
                filteredAlumni.map((person) => (
                  <AlumniCard
                    key={person._id}
                    person={person}
                    onClick={() => handleAlumniClick(person)}
                  />
                ))
              )}
            </div>
          </motion.div>
        ) : (
          // Show batch-wise sections with pagination
          batchYears.map((year) => (
            <BatchSection
              key={year}
              batchYear={year}
              alumni={groupedAlumni[year]}
              onAlumniClick={handleAlumniClick}
              itemsPerPage={6}
            />
          ))
        )}

        {selectedAlumni && (
          <AlumniProfileModal
            alumni={selectedAlumni}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedAlumni(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Alumni;
