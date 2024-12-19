import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              JNV Alumni
            </Link>
            <div className="ml-6">
              <NavLinks />
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 hidden sm:inline">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            )}
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
