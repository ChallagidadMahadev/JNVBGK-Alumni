import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Newspaper, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Manage Alumni"
            icon={<Users className="w-6 h-6" />}
            description="View and manage alumni accounts"
            link="/admin/alumni"
          />
          <DashboardCard
            title="Manage Events"
            icon={<Calendar className="w-6 h-6" />}
            description="Create and manage events"
            link="/admin/events"
          />
          <DashboardCard
            title="Manage News"
            icon={<Newspaper className="w-6 h-6" />}
            description="Post and manage news articles"
            link="/admin/news"
          />
          <DashboardCard
            title="Settings"
            icon={<Settings className="w-6 h-6" />}
            description="Configure website settings"
            link="/admin/settings"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ 
  title, 
  icon, 
  description, 
  link 
}: { 
  title: string; 
  icon: React.ReactNode; 
  description: string; 
  link: string; 
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <Link to={link} className="block">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </Link>
  </motion.div>
);

export default AdminDashboard;