import React from "react";

const Toast = ({ message, onClose }) => {
  return (
    <div className="fixed top-10 right-10 bg-black text-white px-4 py-2 rounded shadow-lg animate-slide-in">
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold">&times;</button>
      </div>
    </div>
  );
};

export default Toast;