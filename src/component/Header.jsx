

import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import NotificationDropdown from "./NotifiactionDropdown";
import MonthlyLimitDropdown from "./MonthlyLimitDropdown";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <header className="w-full bg-white shadow-sm px-4 py-2 flex justify-between items-center">

      {/* Left Logo */}
      <div className="flex items-center gap-2 min-w-[90px]">
        <div className="bg-green-500 text-white p-1 rounded-lg font-bold"></div>
        <h1 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
          Expense Tracker
        </h1>
      </div>

      {/* Center Search */}
      <div className="relative flex-1 mx-2 min-w-[100px]">
        <Search className="absolute left-2 top-2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-8 pr-2 py-1 text-xs sm:text-sm bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-[120px] justify-end">

        {/* Notification Bell */}
        <NotificationDropdown />

        {/* Monthly Limit */}
        <MonthlyLimitDropdown />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-xl hover:bg-gray-200 transition"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
            />
            <ChevronDown size={14} />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden z-50 text-xs sm:text-sm">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;