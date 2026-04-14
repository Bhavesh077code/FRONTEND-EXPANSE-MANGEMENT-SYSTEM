
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  MoreVertical,
  Plus,
  Trash2,
  Edit3,
  Wallet,
  Calendar,
  Utensils,
  ShoppingBag,
  Home,
  Zap,
  Package
} from "lucide-react";
import { connectSocket, getSocket } from "../socket";
import Toast from "./Toast";
import BASE_URL from "../../api";

const ViewExpense = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const dropdownRefs = useRef({});
  const [toast, setToast] = useState(null);

  // ==============================
  // FETCH EXPENSES (FIXED + DEBUG)
  // ==============================
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Session expired. Please login.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/expense/get-create`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setExpenses(res.data.expense || []);
    } catch (err) {
     // console.error("❌ Fetch error:", err);
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchExpenses();
  }, []);


  // SOCKET
  useEffect(() => {
    //console.log("🔌");
    const userId = localStorage.getItem("userId");
    //console.log("📍 userId:", userId);

    if (!userId) {
      return;
    }

    try {
      connectSocket(userId);
    } catch (err) {
      //console.error("❌ Socket connect error:", err);
    }

    const socket = getSocket();
    if (!socket) {
      return;
    }

    const handleDelete = (data) => {
     // console.log("🗑️ [Socket] ExpenseDeleted:", data);
      setToast("Expense Deleted!");
      fetchDashboardData();
      fetchExpenses();
      setTimeout(() => setToast(null), 3000);
    };

    socket.off("ExpenseDeleted");
    socket.on("ExpenseDeleted", handleDelete);

    return () => {
     //console.log("🧹 Cleaning socket listeners");
      socket.off("ExpenseDeleted", handleDelete);
    };
  }, []);


  // OUTSIDE CLICK CLOSE MENU
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeMenu &&
        dropdownRefs.current[activeMenu] &&
        !dropdownRefs.current[activeMenu].contains(event.target)
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);


  // HELPERS
  const getIcon = (cat) => {
    switch (cat) {
      case "Food":
        return <Utensils size={18} />;
      case "Shopping":
        return <ShoppingBag size={18} />;
      case "Travel":
        return <Home size={18} />;
      case "Bills":
        return <Zap size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  const handleEdit = (item) => {
   // console.log("✏️ Editing:", item);
    navigate(`/edit/${item._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this?")) return;

    try {
     // console.log("🗑️ Deleting expense:", id);
      const token = localStorage.getItem("token");

      await axios.delete(
        `${BASE_URL}/expense/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
     // console.log("✅ Deleted successfully");
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

 
  // LOADING UI (UNCHANGED)
  if (loading)
    return (
      <div className="p-6 space-y-4">
        <Skeleton height={80} borderRadius={20} />
        <Skeleton count={4} height={120} borderRadius={24} />
      </div>
    );

  // MAIN UI (UNCHANGED)
  return (
    <div className="bg-[#F4F7FE] min-h-screen pb-20 font-sans">

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="bg-white px-6 py-6 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-2xl text-white">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">
              Total Expenses
            </p>
            <h2 className="text-xl font-black text-slate-800">
              ₹
              {expenses
                .reduce((sum, i) => sum + Number(i.amount), 0)
                .toLocaleString()}
            </h2>
          </div>
        </div>

        <button
          onClick={() => navigate("/add-expense")}
          className="p-3 bg-slate-900 text-white rounded-2xl"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">

        <p className="text-[11px] font-black text-slate-400 uppercase">
          Recent Transactions
        </p>

        {expenses.length > 0 ? (
          [...expenses]
           // .sort((a, b) => new Date(b.date) - new Date(a.date))
           .map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 relative"
              >
                <div className="flex justify-between mb-4">

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      {getIcon(item.category)}
                    </div>

                    <div>
                      <h4 className="text-slate-800 font-black uppercase">
                        {item.title}
                      </h4>
                      <span className="text-[10px] bg-slate-100 px-2 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div
                    className="relative"
                    ref={(el) => (dropdownRefs.current[item._id] = el)}
                  >
                    <p className="text-indigo-600 font-black">
                      ₹{item.amount}
                    </p>


                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === item._id ? null : item._id
                        )
                      }
                    // className="flex justify-end p-2 px-4 py-2  text-black-300 hover:text-slate-600"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {activeMenu === item._id && (
                      <div className="absolute right-0 top-10 bg-white shadow-xl rounded-2xl w-32 z-50">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex gap-2 px-4 py-3 w-full"
                        >
                          <Edit3 size={14} /> Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex gap-2 px-4 py-3 w-full text-red-500"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {item.description && (
                  <p className="text-slate-400 text-xs bg-slate-50 p-3 rounded-2xl">
                    {item.description}
                  </p>
                )}

                <div className="flex justify-between mt-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-2 text-slate-400" >
                    <Calendar size={12} />{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span><b>{item.paymentMethod}</b></span>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-20 text-slate-300 font-bold">
            No records yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExpense;


