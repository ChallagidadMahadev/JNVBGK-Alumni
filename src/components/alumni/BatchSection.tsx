import React from "react";
import { motion } from "framer-motion";
import { Alumni } from "../../types";
import AlumniCard from "./AlumniCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BatchSectionProps {
  batchYear: number;
  alumni: Alumni[];
  onAlumniClick: (alumni: Alumni) => void;
  itemsPerPage?: number;
}

const BatchSection: React.FC<BatchSectionProps> = ({
  batchYear,
  alumni,
  onAlumniClick,
  itemsPerPage = 6,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const getBatchNumber = (year: number) => year - 2007;
  const totalPages = Math.ceil(alumni.length / itemsPerPage);

  // Get paginated alumni
  const displayedAlumni = isExpanded
    ? alumni
    : alumni.slice(0, page * itemsPerPage);

  const showLoadMore = !isExpanded && page * itemsPerPage < alumni.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Batch {getBatchNumber(batchYear)} ({batchYear})
          </h2>
          <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {alumni.length} Alumni
          </span>
        </div>

        {alumni.length > itemsPerPage && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <span>{isExpanded ? "Show Less" : "Show All"}</span>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        {displayedAlumni.map((person) => (
          <motion.div
            key={person._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <AlumniCard person={person} onClick={() => onAlumniClick(person)} />
          </motion.div>
        ))}
      </motion.div>

      {showLoadMore && (
        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage((prev) => prev + 1)}
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
          >
            Load More
            <ChevronDown className="ml-2 h-4 w-4" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default BatchSection;
