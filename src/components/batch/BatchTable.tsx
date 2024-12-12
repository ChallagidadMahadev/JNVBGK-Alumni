import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { BatchStudent } from "../../types/batch";
import { HOUSE_COLORS } from "../../types/constants";

interface BatchTableProps {
  students: BatchStudent[];
  isAdmin?: boolean;
  onEdit?: (student: BatchStudent) => void;
  onDelete?: (student: BatchStudent) => void;
}

const BatchTable: React.FC<BatchTableProps> = ({
  students,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const getHouseColor = (house: string) => {
    return HOUSE_COLORS[house as keyof typeof HOUSE_COLORS] || "156, 163, 175";
  };

  // Sort students alphabetically by name
  const sortedStudents = [...students].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roll Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              House
            </th>
            {isAdmin && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedStudents.map((student, index) => (
            <motion.tr
              key={student.rollNumber || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {(index + 1).toString().padStart(3, "0")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {student.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {student.house ? (
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `rgba(${getHouseColor(
                        student.house
                      )}, 0.1)`,
                      color: `rgb(${getHouseColor(student.house)})`,
                    }}
                  >
                    {student.house}
                  </span>
                ) : (
                  "-"
                )}
              </td>
              {isAdmin && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit?.(student)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete?.(student)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BatchTable;
