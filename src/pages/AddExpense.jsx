

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ArrowLeft, Type, Banknote, Grid3X3, Wallet, Calendar as CalendarIcon, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { connectSocket, getSocket } from "../socket";
import Toast from "../component/Toast";
import BASE_URL from "../../api";

export default function AddExpense() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "",
        paymentMethod: "Cash",
        description: "",
        date: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // SOCKET LISTENER FOR REAL-TIME UPDATES
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        //console.log("👤 userId:", userId);

        if (!userId) {
            return;
        }

        connectSocket(userId);
        //ALWAYS fetch socket like this
        const socket = getSocket();
        if (!socket) {
            return;
        }

        const handler = (data) => {
           //console.log("📡", data);

            setToast(
                data?.expense
                    ? `New Expense Added: ${data.expense.title} ₹${data.expense.amount}`
                    : "New Expense Added!"
            );

            setTimeout(() => setToast(null), 4000);
        };

        socket.off("newExpense"); // cleanup old listeners
        socket.on("newExpense", handler);

        return () => {
         socket.off("newExpense", handler);
        };
    }, []);


    // ================= SUBMIT DEBUG FIX =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("⚠️ No token found");
                setError("Please login first");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                amount: Number(formData.amount)
            };


            const res = await axios.post(
                `${BASE_URL}/expense/create`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(res.data.message || "Expense added successfully");

            setTimeout(() => navigate("/dashboard"), 1000);

        } catch (err) {
            console.error("❌ Error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-8">

            <style dangerouslySetInnerHTML={{
                __html: `
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
                .date-container input[type="date"] { display: flex; align-items: center; box-sizing: border-box; }
            `}} />

            {/* Back Button */}
            <button
                className="fixed top-6 left-6 flex items-center gap-2 text-gray-800 hover:text-emerald-600 font-semibold transition-all group z-50"
                onClick={() => {
                    console.log("⬅️ Back clicked");
                    navigate("/dashboard");
                }}
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back</span>
            </button>

            <div className="w-full max-w-[550px] animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 text-center relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="inline-flex p-4 bg-white/20 rounded-[2rem] backdrop-blur-xl mb-4 border border-white/30">
                            <PlusCircle className="text-white w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">New Expense</h2>
                        <p className="text-emerald-50/70 text-sm font-medium mt-1">Keep your finances on track</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-7">

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Description</label>
                            <div className="relative group">
                                <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Lunch, Petrol, Rent..."
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-slate-700 font-bold placeholder:font-normal box-border"
                                />
                            </div>
                        </div>

                        {/* Amount + Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Amount</label>
                                <div className="relative group">
                                    <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-slate-700 font-black text-lg box-border"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 date-container">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Date</label>
                                <div className="relative group">
                                    <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-slate-700 font-bold appearance-none min-h-[60px] box-border"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category + Payment */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Category</label>
                                <div className="relative group">
                                    <Grid3X3 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-slate-700 appearance-none font-bold cursor-pointer box-border"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Food">Food & Drinks</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Travel">Room Rent</option>
                                        <option value="Bills">Monthly Bills</option>
                                        <option value="Other">Miscellaneous</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Payment</label>
                                <div className="relative group">
                                    <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-slate-700 appearance-none font-bold cursor-pointer box-border"
                                    >
                                        <option value="Cash">Physical Cash</option>
                                        <option value="Esewa">eSewa Wallet</option>
                                        <option value="Khalti">Khalti Wallet</option>
                                        <option value="MobileBanking">Bank Transfer</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Notes (Optional)</label>
                            <div className="relative group">
                                <FileText className="absolute left-5 top-5 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                <textarea
                                    name="description"
                                    placeholder="Add more details..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-slate-700 font-medium resize-none h-32 box-border"
                                />
                            </div>
                        </div>

                        {/* Toast + Error + Success */}
                        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
                        {error && (
                            <div className="flex items-center gap-3 p-5 bg-rose-50 text-rose-700 rounded-[1.5rem] border border-rose-100">
                                <AlertCircle className="w-6 h-6" />
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-3 p-5 bg-emerald-50 text-emerald-700 rounded-[1.5rem] border border-emerald-100">
                                <CheckCircle2 className="w-6 h-6" />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-[2rem] font-black text-white transition-all text-lg
                            ${loading ? "bg-slate-300" : "bg-emerald-600 hover:bg-emerald-500"}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Saving...
                                </span>
                            ) : "Add to Expenses"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}