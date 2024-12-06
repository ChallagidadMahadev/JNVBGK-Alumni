import React from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Newspaper, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "../../hooks/useNews";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Dashboard = () => {
  const { getNews } = useNews();
  const { data: news, isLoading } = getNews;

  const stats = {
    totalNews: news?.length || 0,
    published: news?.filter((n) => n.status === "published").length || 0,
    drafts: news?.filter((n) => n.status === "draft").length || 0,
    totalViews: news?.reduce((acc, n) => acc + n.viewCount, 0) || 0,
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total News"
            value={stats.totalNews}
            icon={<Newspaper className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            title="Published"
            value={stats.published}
            icon={<Calendar className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="Drafts"
            value={stats.drafts}
            icon={<Users className="w-6 h-6" />}
            color="yellow"
          />
          <StatsCard
            title="Total Views"
            value={stats.totalViews}
            icon={<Settings className="w-6 h-6" />}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction
            title="Manage News"
            description="Create, edit, and publish news articles"
            icon={<Newspaper className="w-8 h-8" />}
            to="/admin/news"
            color="blue"
          />
          <QuickAction
            title="Manage Events"
            description="Organize and schedule upcoming events"
            icon={<Calendar className="w-8 h-8" />}
            to="/admin/events"
            color="green"
          />
          <QuickAction
            title="Manage Alumni"
            description="View and manage alumni profiles"
            icon={<Users className="w-8 h-8" />}
            to="/admin/alumni"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "purple";
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const QuickAction = ({
  title,
  description,
  icon,
  to,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: "blue" | "green" | "purple";
}) => {
  const colorClasses = {
    blue: "hover:bg-blue-50 text-blue-600",
    green: "hover:bg-green-50 text-green-600",
    purple: "hover:bg-purple-50 text-purple-600",
  };

  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`bg-white rounded-lg shadow-md p-6 ${colorClasses[color]} transition-colors duration-200`}
      >
        <div className="flex items-center mb-4">{icon}</div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </motion.div>
    </Link>
  );
};

export default Dashboard;
