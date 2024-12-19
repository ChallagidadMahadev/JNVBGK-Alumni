import React, { useState } from "react";
import {
  Menu,
  X,
  Users,
  GraduationCap,
  Calendar,
  Newspaper,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import NavLink from "./NavLink"; // Fixed import path

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-white shadow-lg p-4 space-y-2"
          >
            <NavLink to="/alumni" icon={Users} label="Alumni" />
            <NavLink to="/faculty" icon={GraduationCap} label="Faculty" />
            {isAuthenticated && (
              <>
                <NavLink to="/events" icon={Calendar} label="Events" />
                <NavLink to="/news" icon={Newspaper} label="News" />
                <NavLink to="/batches" icon={List} label="Batch List" />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;
