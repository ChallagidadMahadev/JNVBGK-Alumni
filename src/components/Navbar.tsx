import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  GraduationCap,
  Settings,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { femaleProfileSvg, maleProfileSvg } from "../utils/profileIcons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await logout();
      toast.success("Successfully logged out");
    } catch (error) {
      toast.error("Error logging out");
    } finally {
      setIsLoggingOut(false);
      setShowUserMenu(false);
    }
  };

  const getDefaultProfilePicture = () => {
    if (!user) return "";
    return user.gender === "female" ? femaleProfileSvg : maleProfileSvg;
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">
                JNV Alumni
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" isActive={location.pathname === "/"}>
              Home
            </NavLink>
            <NavLink to="/events" isActive={location.pathname === "/events"}>
              Events
            </NavLink>
            <NavLink to="/alumni" isActive={location.pathname === "/alumni"}>
              Alumni
            </NavLink>
            <NavLink to="/news" isActive={location.pathname === "/news"}>
              News
            </NavLink>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                  disabled={isLoggingOut}
                >
                  <motion.img
                    src={user?.profilePicture || getDefaultProfilePicture()}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
                    whileHover={{ scale: 1.1 }}
                  />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                    >
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {isLoggingOut ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                            Logging out...
                          </div>
                        ) : (
                          <>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink
                to="/"
                onClick={() => setIsOpen(false)}
                isActive={location.pathname === "/"}
              >
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/events"
                onClick={() => setIsOpen(false)}
                isActive={location.pathname === "/events"}
              >
                Events
              </MobileNavLink>
              <MobileNavLink
                to="/alumni"
                onClick={() => setIsOpen(false)}
                isActive={location.pathname === "/alumni"}
              >
                Alumni
              </MobileNavLink>
              <MobileNavLink
                to="/news"
                onClick={() => setIsOpen(false)}
                isActive={location.pathname === "/news"}
              >
                News
              </MobileNavLink>
              {isAuthenticated ? (
                <>
                  <MobileNavLink
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    isActive={location.pathname === "/settings"}
                  >
                    Settings
                  </MobileNavLink>
                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  >
                    {isLoggingOut ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                        Logging out...
                      </div>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </>
              ) : (
                <MobileNavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  isActive={location.pathname === "/login"}
                >
                  Login
                </MobileNavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}

const NavLink = ({ to, children, isActive }: NavLinkProps) => (
  <Link
    to={to}
    className={`relative text-gray-600 hover:text-blue-600 transition duration-300 py-2 ${
      isActive ? "text-blue-600" : ""
    }`}
  >
    {children}
    {isActive && (
      <motion.div
        layoutId="navbar-indicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

const MobileNavLink = ({
  to,
  children,
  onClick,
  isActive,
}: MobileNavLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-3 py-2 text-base font-medium ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
