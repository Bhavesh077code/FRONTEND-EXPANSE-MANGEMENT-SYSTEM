
import React, { useState, useRef, useEffect } from "react";
import { DollarSign } from "lucide-react";
import axios from "axios";
import { connectSocket } from "../socket";
import BASE_URL from "../../api";

const MonthlyLimitDropdown = ({ totalSpent = 0 }) => {
  const [openLimit, setOpenLimit] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [toast, setToast] = useState(null);
  const limitRef = useRef();

  // 🔥 SAFE CALCULATION
  const safeLimit = Number(monthlyLimit) || 0;
  const safeSpent = Number(totalSpent) || 0;

  const spentPercentage =
    safeLimit > 0 ? Math.min((safeSpent / safeLimit) * 100, 100) : 0;

    //SOCKET FOR REAL-TIME UPDATES
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const socket = connectSocket(userId);
    if (!socket) return;

    const handleLimitUpdated = (data) => {
      //console.log("🎯 limitUpdated received:", data);

      if (!data) return;
      // UPDATE STATE IMPORTANT
      setMonthlyLimit(data.monthlyLimit);
      setToast("Monthly limit updated!");
      setTimeout(() => setToast(null), 3000);
    };

    socket.off("limitUpdated");
    socket.on("limitUpdated", handleLimitUpdated);
    socket.on("notification", (data) => {
      addNotification(data.message);
    });

    return () => {
      socket.off("limitUpdated", handleLimitUpdated);
      socket.off("notification");
    };
  }, []);


  /*OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (limitRef.current && !limitRef.current.contains(event.target)) {
        setOpenLimit(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  //Save limit
  const handleSaveLimit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
      //  console.warn("⚠️ No token found");
        return;
      }

      await axios.put( `${BASE_URL}/expense/set-limit`,
        { monthlyLimit: safeLimit },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔥 ADD THIS (IMPORTANT)
      setMonthlyLimit(safeLimit);   // instantly update UI
      setOpenLimit(false);          // close dropdown

      setOpenLimit(false);
    } catch (err) {
    //  console.log(
      //  "❌ Failed to update monthly limit:",
      ///  err.response?.data || err.message
     // );
    }
  };

  const getMotivation = () => {
    if (!safeLimit) return "Set your monthly limit!";
    if (spentPercentage < 50) return "Great! You're under control.";
    if (spentPercentage < 80) return "Be careful, spending is rising.";
    return "Warning! Approaching your limit.";
  };

  return (
    <div className="relative" ref={limitRef}>
      <button
        onClick={() => setOpenLimit(!openLimit)}
        className="p-2 rounded-full hover:bg-gray-200 transition"
      >
        <DollarSign size={24} />
      </button>

      {openLimit && (
        <div className="absolute right-0 mt-2 w-72 sm:w-64 bg-white text-gray-800 rounded-2xl shadow-lg border border-gray-200 p-4 z-50">
          <h3 className="font-semibold mb-2 text-center">
            Set Monthly Limit
          </h3>

          <input
            type="number"
            placeholder="Enter limit"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-2"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
          />

          {monthlyLimit && (
            <input
              type="range"
              min={0}
              max={monthlyLimit}
              value={safeSpent}
              readOnly
              className="w-full h-2 rounded-lg accent-green-500 mb-2"
            />
          )}

          {monthlyLimit && (
            <div className="w-full h-3 bg-gray-200 rounded-full mb-2">
              <div
                className={`h-3 rounded-full ${spentPercentage < 50
                  ? "bg-green-500"
                  : spentPercentage < 80
                    ? "bg-yellow-400"
                    : "bg-red-500"
                  }`}
                style={{ width: `${spentPercentage}%` }}
              ></div>
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mb-2">
            {getMotivation()}
          </p>

          <button
            onClick={handleSaveLimit}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Save
          </button>

          {toast && (
            <div className="mt-2 p-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm text-center">
              {toast}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlyLimitDropdown;