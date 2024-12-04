import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getNews } from '../utils/api';
import { News as NewsType } from '../types';
import { toast } from 'react-hot-toast';

const News = () => {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNews(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
        toast.error('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = activeCategory === 'all'
    ? news
    : news.filter((item) => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600 py-12">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest News</h1>

        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {['all', 'announcement', 'achievement', 'event', 'general'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition duration-300`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-8"
        >
          {filteredNews.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              <p>No news articles available in this category.</p>
            </div>
          ) : (
            filteredNews.map((item) => (
              <NewsCard key={item._id} news={item} />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

const NewsCard = ({ news }: { news: NewsType }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="bg-white rounded-lg shadow-md overflow-hidden"
  >
    <div className="md:flex">
      {news.image && (
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full md:w-48 object-cover"
            src={news.image}
            alt={news.title}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            news.category === 'announcement' ? 'bg-blue-100 text-blue-800' :
            news.category === 'achievement' ? 'bg-green-100 text-green-800' :
            news.category === 'event' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            {format(new Date(news.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{news.title}</h2>
        <p className="text-gray-600">{news.content}</p>
      </div>
    </div>
  </motion.div>
);

export default News;