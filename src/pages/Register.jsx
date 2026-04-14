


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Mail,
  ArrowRight,
  Loader2,
  ChevronLeft
} from "lucide-react";
import BASE_URL from "../../api";

export default function SendOtp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/user/send-otp`,
        { username, email },
        { withCredentials: true }
      );


      // SAFE USER ID STORE
      if (res.data?.user?._id) {
        localStorage.setItem("userId", res.data.user._id);
        //console.log("💾 userId saved:", res.data.user._id);
      } else {
        console.warn("⚠ userId missing in response");
      }

      setMessage(res.data.message || "OTP sent successfully");

      setTimeout(() => {
        //console.log("🚀 Navigating to verify page");
        navigate("/verify", { state: { email } });
      }, 1000);

    } catch (err) {

      if (err.response) {
        setError(err.response.data?.message || "Something went wrong");
      } else if (err.request) {
        setError("Server not reachable. Check your connection.");
      } else {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0F172A] px-4 z-[100] selection:bg-emerald-500/30">

      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-[120px]" />

      <button
        onClick={() => {
          console.log("⬅ Back clicked");
          navigate("/");
        }}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <div className="w-full max-w-[420px] relative mx-auto sm:mx-0">

        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#1e293b] border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl z-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />
          <UserPlus size={32} className="text-emerald-400 relative z-10" />
        </div>

        <div className="relative bg-white/5 backdrop-blur-[30px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] rounded-[3rem] p-8 sm:p-10 pt-16 text-white overflow-hidden animate-in fade-in zoom-in duration-500">

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="text-center mb-8 sm:mb-10 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">
              Join the Elite
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              Start your wealth journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-1">
                Username
              </label>

              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 placeholder-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all font-medium text-sm"
                  placeholder="Choose a unique name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-1">
                Email Address
              </label>

              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 placeholder-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all font-medium text-sm"
                  placeholder="Enter your best email"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-900 disabled:cursor-not-allowed py-4 sm:py-5 rounded-2xl font-black text-xs text-[#0F172A] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(16,185,129,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 mt-3 sm:mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Send Secure OTP <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Messages */}
            <div className="min-h-[20px]">
              {message && (
                <p className="text-emerald-400 text-center text-[11px] font-bold animate-pulse">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-red-400 text-center text-[11px] font-bold">
                  {error}
                </p>
              )}
            </div>
          </form>

          <p className="text-center text-[10px] text-slate-500 font-medium mt-4 sm:mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/verify")}
              className="text-emerald-400 cursor-pointer hover:underline"
            >
              Verify Code
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}