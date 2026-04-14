
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import QuickStats from "../component/QuickStats";
import ViewExpense from "../component/ViewExpense";
import Toast from "../component/Toast"; // ✅ FIX: missing import

export default function Dashboard() {
    const [toast, setToast] = React.useState(null);
    const navigate = useNavigate();

    const username = localStorage.getItem("username");
 {/*
    //DEBUG component mount
    useEffect(() => {
        //console.log("📊 Dashboard mounted");
       // console.log("👤 username:", username);
       // console.log("🆔 userId:", localStorage.getItem("userId"));
    console.log("🔑 token exists:", !!localStorage.getItem("token"));
    }, []);  */}

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4 md:gap-0">
                    <div className="w-full md:w-auto">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                            Welcome, {username || "User"}!
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-base">
                            Here’s a quick overview of your expenses
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            navigate("/add-expense");
                        }}
                        className="w-full md:w-auto mt-2 md:mt-0 bg-gray-800 hover:bg-gray-900 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-md transition duration-300"
                    >
                        Add Expense
                    </button>
                </div>

                {toast && (
                    <>
                        {/* {console.log("🍞 Toast:", toast)} */}
                        <Toast message={toast} onClose={() => setToast(null)} />
                    </>
                )}

                <QuickStats />

                <ViewExpense />
            </div>
        </div>
    );
}

