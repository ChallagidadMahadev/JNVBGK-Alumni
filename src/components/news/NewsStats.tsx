import React from "react";
import { motion } from "framer-motion";
import { News } from "../../types/news";
import { Newspaper, CheckCircle, Clock, Eye } from "lucide-react";

interface NewsStatsProps {
  news: News[];
}

const NewsStats: React.FC<NewsStatsProps> = ({ news }) => {
  const stats = {
    total: news.length,
    published: news.filter((n) => n.status === "published").length,
    drafts: news.filter((n) => n.status === "draft").length,
    totalViews: news.reduce((acc, n) => acc + n.viewCount, 0),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total News"
        value={stats.total}
        icon={<Newspaper className="w-6 h-6" />}
        color="blue"
      />
      <StatCard
        title="Published"
        value={stats.published}
        icon={<CheckCircle className="w-6 h-6" />}
        color="green"
      />
      <StatCard
        title="Drafts"
        value={stats.drafts}
        icon={<Clock className="w-6 h-6" />}
        color="yellow"
      />
      <StatCard
        title="Total Views"
        value={stats.totalViews}
        icon={<Eye className="w-6 h-6" />}
        color="purple"
      />
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "purple";
}> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="mt-4">
        <div
          className={`h-1 rounded-full ${colorClasses[color].replace(
            "100",
            "200"
          )}`}
        >
          <div
            className={`h-1 rounded-full ${colorClasses[color].replace(
              "100",
              "600"
            )}`}
            style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NewsStats;
