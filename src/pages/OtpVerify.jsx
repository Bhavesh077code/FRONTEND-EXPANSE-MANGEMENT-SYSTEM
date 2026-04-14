
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Mail, KeyRound, Loader2 } from "lucide-react";
import BASE_URL from "../../api";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  //  Prefill email
  useEffect(() => {

    if (location.state?.email) {
      setEmail(location.state.email);
      //console.log("📧 Email prefilled from navigation:", location.state.email);
    } else {
      //console.warn("⚠ No email passed from SendOtp page");
    }
  }, [location.state]);

  const handleVerify = async (e) => {
    e.preventDefault();

    console.log("🟡 OTP verification started");
    console.log("📦 email:", email);
    console.log("📦 otp:", otp);

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        `${BASE_URL}/user/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );


      if (res.data?.user?._id) {
        localStorage.setItem("userId", res.data.user._id);
      } else {
       // console.warn("⚠ userId missing in verify response");
      }

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        //console.log("🔐 token saved");
      } else {
       // console.warn("⚠ token missing in response");
      }

      if (res.data?.user?.username) {
        localStorage.setItem("username", res.data.user.username);
        //console.log("👤 username saved:", res.data.user.username);
      }

      setMessage(res.data.message || "Verified successfully");

      setTimeout(() => {
        //console.log("🚀 Redirecting to dashboard");
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      //console.error("🔴 OTP VERIFY ERROR:", err);

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

      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-[120px]" />

      <button
        onClick={() => {
          navigate("/register");
        }}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Access
      </button>

      <div className="w-full max-w-[420px] relative mx-auto sm:mx-0">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#1e293b] border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl z-20">
          <ShieldCheck size={32} className="text-emerald-400" />
        </div>

        <form
          onSubmit={handleVerify}
          className="relative bg-white/5 backdrop-blur-[30px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] rounded-[3rem] p-8 sm:p-10 pt-16 text-white space-y-6 animate-in fade-in zoom-in duration-500 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">
              Identity Check
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              Secure your wealth
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2 sm:space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 placeholder-slate-600 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            {/* OTP */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-1">
                Verification Code
              </label>
              <div className="relative group">
                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 placeholder-slate-600 rounded-2xl outline-none tracking-[0.5em] text-center text-lg font-black focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:cursor-not-allowed py-4 rounded-2xl font-black text-xs text-[#0F172A] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(16,185,129,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Authorize Access"
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

          {/* Resend OTP */}
          <p className="text-center text-[10px] text-slate-500 font-medium">
            Didn't receive the code?{" "}
            <span
              className="text-emerald-400 cursor-pointer hover:underline"
              onClick={async () => {

                try {
                  setLoading(true);

                  const res = await axios.post(
                    "http://192.168.1.67:3000/user/send-otp",
                    { email },
                    { withCredentials: true }
                  );

                  setMessage("OTP resent successfully");
                  setError("");
                } catch (err) {
                  setError(err.response?.data?.message || "Unable to resend OTP");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Resend
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;