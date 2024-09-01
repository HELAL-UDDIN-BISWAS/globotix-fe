// contexts/auth.js
"use client";
import React, { createContext, useContext } from "react";
import { toast, Toaster } from "react-hot-toast";

//api here is an axios instance which has the baseURL set according to the env.

const ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
  const showToast = (content) => {
    toast.custom((t) => (
      <div
        style={{ background: "#FEF5D8" }}
        className="text-xs text-black-1 bg-yellow-2 shadow-md rounded-[10px] px-4 py-2.5"
      >
        {content}
      </div>
    ));
  };

  const showToastError = (content) => {
    toast.custom((t) => (
      <div
        style={{ background: "#A70000" }}
        className="text-xs text-white bg-red-1 shadow-md rounded-[10px] px-4 py-2.5"
      >
        {content}
      </div>
    ));
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showToastError,
      }}
    >
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
