import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface FacultySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const FacultySearch: React.FC<FacultySearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 mb-6"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search faculty by name..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </motion.div>
  );
};

export default FacultySearch;
