


import React, { useEffect, useState, useRef } from "react";
import { Bell, MoreHorizontal } from "lucide-react";
import axios from "axios";
import { connectSocket } from "../socket";
import BASE_URL from "../../api";


const NotificationDropdown = () => {
  const [openNotif, setOpenNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef();
  const [activeMenu, setActiveMenu] = useState(null);


  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${BASE_URL}/expense/notification`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = Array.isArray(res.data) ? res.data : res.data.notifications || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      //console.log("Notification fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setOpenNotif(false);
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Socket for real-time notifications
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const socket = connectSocket(userId);
    if (!socket) return;

    const handleNewNotification = async () => {
      await fetchNotifications();
    };

    socket.off("newNotification");
    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, []);


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/expense/delete/notification/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setUnreadCount((prev) => prev - 1);
      setActiveMenu(null);
    } catch (err) {
     // console.log("Delete error:", err);
      //console.log("Mark read error:", err);
    }
  };


  const handleOpen = () => {
    setOpenNotif(!openNotif);
    if (!openNotif && unreadCount > 0) {
      // Instead of calling backend, just mark locally
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };


  return (
    <div className="relative" ref={notifRef}>

      <button
        onClick={handleOpen}
        className="relative p-1 rounded-full hover:bg-gray-200 transition"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>


      {openNotif && (
        <div
          className="fixed top-[60px] left-1/2 -translate-x-1/2 w-[90vw] max-w-xs bg-white text-gray-800 rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50"
        >
          <h3 className="font-semibold p-3 border-b border-gray-200 text-center">
            Notifications
          </h3>
          <div className="max-h-52 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-3 text-gray-500 text-center">No notifications</p>
            ) : (
              notifications.map((note) => (
                <div
                  key={note._id}
                  className="flex justify-between items-start p-3 border-b border-gray-100 hover:bg-gray-100 transition relative"
                >
                  <div>
                    <p className="text-sm">{note.message}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>


                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === note._id ? null : note._id)
                      }
                      className="p-1 text-gray-400 hover:text-gray-800"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {activeMenu === note._id && (
                      <div className="absolute right-0 top-6 w-24 bg-white border border-gray-200 rounded-md shadow-md z-50">
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

