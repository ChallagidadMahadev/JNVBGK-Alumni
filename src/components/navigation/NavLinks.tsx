import React from "react";
import { Users, GraduationCap, Calendar, Newspaper, List } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NavLink from "./NavLink"; // Fixed import path

const NavLinks = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="hidden sm:flex sm:space-x-4">
      <NavLink to="/alumni" icon={Users} label="Alumni" />
      <NavLink to="/faculty" icon={GraduationCap} label="Faculty" />
      {isAuthenticated && (
        <>
          <NavLink to="/events" icon={Calendar} label="Events" />
          <NavLink to="/news" icon={Newspaper} label="News" />
          <NavLink to="/batches" icon={List} label="Batch List" />
        </>
      )}
    </div>
  );
};

export default NavLinks;
