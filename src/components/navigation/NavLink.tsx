import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
          isActive
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Icon className="w-5 h-5 mr-2" />
        <span className="font-medium">{label}</span>
      </motion.div>
    </Link>
  );
};

export default NavLink;
