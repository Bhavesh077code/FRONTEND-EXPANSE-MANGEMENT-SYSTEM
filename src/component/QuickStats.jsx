
import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  ArrowUpRight,
  Target,
  Wallet,
  TrendingDown,
  AlertCircle
} from "lucide-react";
import Toast from "./Toast";
import { connectSocket } from "../socket";
import BASE_URL from "../../api";

const QuickStats = () => {
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // 🔥 DEBUG SAFE FETCH FUNCTION
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Session expired.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/expense/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { totalSpent, monthlyLimit, remaining } = res.data;

      setTotalSpent(totalSpent);
      setMonthlyLimit(monthlyLimit);
      setRemaining(remaining);

    } catch (err) {
      //console.log("❌ Dashboard API error:", err);
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 INITIAL LOAD
  useEffect(() => {
    fetchDashboardData();
  }, []);


  //SOCKEt connection
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
     // console.warn("⚠️ No userId found in localStorage");
      return;
    }

    let socket;

    try {
      socket = connectSocket(userId);
    } catch (err) {
      return;
    }

    if (!socket) {
      return;
    }

    const handler = (data) => {
       // console.log("🎯 limitUpdated received:", data);
      setToast("🎯 Monthly Limit Updated!");
      fetchDashboardData();

      setTimeout(() => setToast(null), 3000);
    };

    socket.off("limitUpdated");
    socket.on("limitUpdated", handler);
    return () => {
    socket.off("limitUpdated", handler);
    };
  }, []);

  useEffect(() => {
    const refresh = () => fetchDashboardData();
    window.addEventListener("limit-updated", refresh);
    return () => window.removeEventListener("limit-updated", refresh);
  }, []);


  if (loading) {
    return (
      <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={80} borderRadius={16} />
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="mx-4 my-2 text-xs text-rose-500 font-bold flex items-center gap-1">
        <AlertCircle size={14} /> {error}
      </div>
    );

  return (
    <div className="px-4 py-4 max-w-7xl mx-auto w-full">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight transition-all">
          Overview
        </h1>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase">
          Live Stats
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        <div className="bg-slate-900 rounded-xl p-4 shadow-md flex items-center gap-4 group transition-all active:scale-95">
          <div className="p-2.5 bg-rose-500/20 rounded-lg">
            <TrendingDown className="text-rose-400 w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Spent
            </p>
            <h2 className="text-lg font-black text-white leading-tight">
              ₹{totalSpent.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 group transition-all active:scale-95">
          <div className="p-2.5 bg-blue-50 rounded-lg">
            <Target className="text-blue-500 w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Limit
            </p>
            <h2 className="text-lg font-black text-slate-800 leading-tight">
              ₹{monthlyLimit.toLocaleString()}
            </h2>
          </div>
        </div>

        <div
          className={`rounded-xl p-4 shadow-sm border flex items-center gap-4 group transition-all active:scale-95
          ${remaining < 0 ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"}`}
        >
          <div
            className={`p-2.5 rounded-lg ${remaining < 0 ? "bg-rose-500" : "bg-emerald-500"
              }`}
          >
            <Wallet className="text-white w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              Balance
            </p>
            <h2
              className={`text-lg font-black leading-tight ${remaining < 0 ? "text-rose-600" : "text-emerald-700"
                }`}
            >
              ₹{remaining.toLocaleString()}
            </h2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuickStats;