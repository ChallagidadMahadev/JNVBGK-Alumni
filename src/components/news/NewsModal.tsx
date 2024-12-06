import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Eye, User } from "lucide-react";
import { format } from "date-fns";
import { News } from "../../types/news";
import { useNews } from "../../hooks/useNews";

interface NewsModalProps {
  news: News;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ news, onClose }) => {
  const { trackView } = useNews();

  useEffect(() => {
    if (news._id) {
      trackView.mutate(news._id);
    }
  }, [news._id]);

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
            className="w-full max-w-3xl bg-white rounded-xl shadow-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {news.title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(news.createdAt), "PPP")}
                </div>
                <div className="flex items-center text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  {news.viewCount} views
                </div>
                {news.author && (
                  <div className="flex items-center text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {/* {news.author.name} */}
                    Alumnis
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                {news.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NewsModal;
