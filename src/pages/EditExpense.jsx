
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Tag,
  DollarSign,
  LayoutGrid,
  CreditCard,
  AlignLeft,
} from "lucide-react";
import { connectSocket, getSocket } from "../socket";
import Toast from "../component/Toast";
import BASE_URL from "../../api";


export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔹 Form State
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    paymentMethod: "Cash",
    description: "",
  });

  // 🔹 UI States
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // 🔥 DEBUG: component mount
  useEffect(() => {

    if (!id) {
      console.error("❌ No expense ID found in URL");
      setError("Invalid expense ID");
      setLoading(false);
    }
  }, [id]);

  // 🔥 SOCKET DEBUG + SAFE INIT
  useEffect(() => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.warn("⚠️ No userId found");
        return;
      }

      // initialize socket
      connectSocket(userId);

      //always fetch real socket instance
      const socket = getSocket();

      if (!socket) {
        return;
      }

      const handleEdit = (data) => {
        //console.log("✏️ Socket event received:", data);

        if (!data) {
          //console.warn("⚠️ Empty socket data received");
          return;
        }

        setToast(data.message || "Expense updated!");
        setTimeout(() => setToast(null), 3000);
      };

      // clean old listeners first
      socket.off("editExpense");
      socket.on("editExpense", handleEdit);

      return () => {
        socket.off("editExpense", handleEdit);
      };
    } catch (err) {
      //console.error("❌ Socket error:", err);
      setError("Socket connection failed");
    }
  }, []);


  // 🔹 Fetch existing expense
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login first.");

        const res = await axios.get(
          `${BASE_URL}/expense/edit/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data.expense;
        setFormData({
          title: data.title || "",
          amount: data.amount || "",
          category: data.category || "",
          paymentMethod: data.paymentMethod || "Cash",
          description: data.description || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load expense");
      }
      setLoading(false);
    };

    fetchExpense();
  }, [id]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? value.replace(/[^0-9.]/g, "") : value,
    }));
  };

  // 🔹 Submit updated expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first.");

      const res = await axios.put(
        `${BASE_URL}/expense/edit/${id}`,
        { ...formData, amount: Number(formData.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast(res.data.message || "Expense updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setToast(err.response?.data?.message || err.message || "Update failed");
    }
    setSubmitLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6">


      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <button
        onClick={() => navigate("/dashboard")}
        className="fixed top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-all group z-50"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to Dashboard</span>
      </button>

      <div className="w-full max-w-[500px]">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">


          <div className="bg-indigo-600 p-8 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">Edit Expense</h2>
            <p className="text-indigo-100 text-sm mt-1 opacity-80">Update your transaction details</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">


            <div className="relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">Title</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="title"
                  placeholder="What was this for?"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>


            <div className="relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium"
                />
              </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">Category</label>
                <div className="relative">
                  <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Transport">Transport</option>
                    <option value="Bills">Bills</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">Method</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 appearance-none"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Esewa">Esewa</option>
                    <option value="Khalti">Khalti</option>
                    <option value="MobileBanking">Mobile Banking</option>
                  </select>
                </div>
              </div>
            </div>


            <div className="relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <textarea
                  name="description"
                  placeholder="Add some notes..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 resize-none h-28"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all
                ${submitLoading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300"}
              `}
            >
              {submitLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Updating...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

