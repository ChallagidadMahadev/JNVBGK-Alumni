import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Eye, Calendar } from "lucide-react";
import { format } from "date-fns";
import { News } from "../../types/news";
import { getCategoryIcon } from "../../utils/newsIcons";
import NewsModal from "./NewsModal";
import { incrementNewsViews } from "../../utils/api";

interface NewsCardProps {
  news: News;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  news,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [viewCount, setViewCount] = useState(news.viewCount);

  const handleClick = async () => {
    try {
      const response = await incrementNewsViews(news._id);
      setViewCount(response.viewCount);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
    setShowModal(true);
  };

  const getCategoryColor = (category: News["category"]) => {
    switch (category) {
      case "announcement":
        return "bg-blue-100 text-blue-800";
      case "achievement":
        return "bg-green-100 text-green-800";
      case "event":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img
                src={getCategoryIcon(news.category)}
                alt={news.category}
                className="w-6 h-6"
              />
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                  news.category
                )}`}
              >
                {news.category}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(news.createdAt), "MMM d, yyyy")}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {news.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{news.content}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-500">
                <Eye className="w-4 h-4 mr-1" />
                {viewCount}
              </div>
              {news.author && (
                <span className="text-sm text-gray-500">
                  {/* By {news.author.name} */}
                  By Alumnis
                </span>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm font-medium ${
                    news.status === "published"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {formatStatus(news.status)}
                </span>
                <div
                  className="flex space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showModal && (
        <NewsModal
          news={{ ...news, viewCount }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default NewsCard;
