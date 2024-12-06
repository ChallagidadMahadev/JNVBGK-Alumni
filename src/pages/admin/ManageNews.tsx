import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useNews } from "../../hooks/useNews";
import NewsCard from "../../components/news/NewsCard";
import NewsForm from "../../components/news/NewsForm";
import NewsFilter from "../../components/news/NewsFilter";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { CreateNews } from "../../types/news";

const ManageNews = () => {
  const { getNews, createNews, updateNews, deleteNews } = useNews();
  const { data: newsItems, isLoading } = getNews;

  const [showNewsForm, setShowNewsForm] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleCreateNews = async (data: CreateNews) => {
    try {
      await createNews.mutateAsync(data);
      setShowNewsForm(false);
    } catch (error) {
      console.error("Error creating news:", error);
    }
  };

  const handleUpdateNews = async (data: CreateNews) => {
    if (!selectedNews) return;
    try {
      await updateNews.mutateAsync({ id: selectedNews._id, news: data });
      setSelectedNews(null);
      setShowNewsForm(false);
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await deleteNews.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const filteredNews = newsItems
    ?.filter((news) => {
      const matchesSearch =
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || news.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "popular":
          return b.viewCount - a.viewCount;
        default: // newest
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

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
          <h1 className="text-3xl font-bold text-gray-900">Manage News</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedNews(null);
              setShowNewsForm(true);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add News
          </motion.button>
        </div>

        <NewsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {filteredNews?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No News Found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your filters"
                : "Click the 'Add News' button to create your first news item"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews?.map((news) => (
              <NewsCard
                key={news._id}
                news={news}
                isAdmin={true}
                onEdit={() => {
                  setSelectedNews(news);
                  setShowNewsForm(true);
                }}
                onDelete={() => handleDeleteNews(news._id)}
              />
            ))}
          </div>
        )}

        {showNewsForm && (
          <NewsForm
            initialData={selectedNews}
            onSubmit={selectedNews ? handleUpdateNews : handleCreateNews}
            onClose={() => {
              setShowNewsForm(false);
              setSelectedNews(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ManageNews;
