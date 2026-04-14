
import React, { useState, useRef } from "react";
import { ArrowRight, ShieldCheck, BarChart3, Wallet, Sparkles, ChevronDown, UserPlus } from "lucide-react";
import SendOtp from "./Register";

const Home = () => {
    const [openMedia, setOpenMedia] = useState(false);
    const featureRef = useRef(null);

    const handleScroll = () => {
        featureRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-emerald-100">
            
            {/* --- HERO SECTION: MODERN DARK GRADIENT --- */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-12 pb-24 px-6 bg-[#0F172A] rounded-b-[4rem] shadow-2xl overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[120px]" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-fade-in">
                        <Sparkles size={12} /> Smart Expense Tracker 2026
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-8 italic">
                        Manage Your <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            Wealth Smartly.
                        </span>
                    </h1>

                    <p className="text-sm md:text-lg text-slate-400 max-w-xl mx-auto mb-12 font-medium leading-relaxed px-4">
                        Track, control, and grow your savings with our powerful and easy-to-use platform. 
                        Join thousands managing their future today.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 items-center px-6">
                        <button 
                            onClick={handleScroll}
                            className="w-full sm:w-auto bg-emerald-500 text-[#0F172A] font-black text-xs px-10 py-5 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                            Get Started <ArrowRight size={18} />
                        </button>

                        <button 
                            onClick={() => setOpenMedia(prev => !prev)}
                            className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/10 text-white font-black text-xs px-10 py-5 rounded-2xl hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                            <UserPlus size={18} className="text-emerald-400" /> 
                            {openMedia ? "Close Form" : "Register"}
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce cursor-pointer" onClick={handleScroll}>
                    <ChevronDown size={24} />
                </div>
            </section>

            {/* --- REGISTRATION MODAL (When openMedia is true) --- */}
            {openMedia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-2">
                        <button 
                            onClick={() => setOpenMedia(false)}
                            className="absolute top-6 right-8 text-slate-400 hover:text-slate-900 z-50 font-bold"
                        > Close </button>
                        <div className="max-h-[90vh] overflow-y-auto">
                             <SendOtp />
                        </div>
                    </div>
                </div>
            )}

            {/* --- FEATURES SECTION (SCROLL TARGET) --- */}
            <section ref={featureRef} className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tighter mb-6">
                                Why smart users <br />
                                <span className="text-emerald-500 underline decoration-slate-200 decoration-8">choose us.</span>
                            </h2>
                            <p className="text-slate-500 font-medium text-lg">
                                We've combined security with simplicity to give you the ultimate edge over your finances.
                            </p>
                        </div>
                        <div className="hidden md:block w-24 h-24 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center animate-spin-slow">
                            <Sparkles className="text-emerald-500" size={32} />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Wallet />, title: "Easy Tracking", desc: "Add and manage your daily expenses effortlessly with 2 taps.", color: "text-emerald-600", bg: "bg-emerald-50" },
                            { icon: <BarChart3 />, title: "Smart Reports", desc: "Get detailed AI-powered insights of your spending habits.", color: "text-indigo-600", bg: "bg-indigo-50" },
                            { icon: <ShieldCheck />, title: "Secure & Reliable", desc: "Your financial data is safe, encrypted and always protected.", color: "text-slate-700", bg: "bg-slate-100" }
                        ].map((feat, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className={`w-14 h-14 ${feat.bg} ${feat.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
                                    {React.cloneElement(feat.icon, { size: 28 })}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4">{feat.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    {feat.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CALL TO ACTION --- */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto bg-[#0F172A] rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">
                            Ready to Take Control <br /> of Your <span className="text-emerald-400">Financial Future?</span>
                        </h2>
                        <button className="bg-white text-[#0F172A] font-black text-xs px-12 py-5 rounded-2xl hover:bg-emerald-400 hover:text-white transition-all active:scale-95 shadow-xl uppercase tracking-widest">
                            Start Tracking Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;