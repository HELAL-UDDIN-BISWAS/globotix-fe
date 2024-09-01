"use client";
import { usePathname, useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";

import { useEffect } from "react";
import LoadingScreenPage from "../features/accounts/view/loadingScreen";

export const ProtectRoute = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated, loading, getMe } = useAuth();

  useEffect(() => {
    async function loadUserFromCookies() {
      getMe();
    }
    loadUserFromCookies();
  }, []);
  if (loading) {
    return (
      <div className="text-black font-2x font-bold w-screen h-screen flex justify-center items-center">
        LOADING...
      </div>
    );
  } else if (
    !loading &&
    !isAuthenticated &&
    pathname !== "/login" &&
    pathname !== "/logout" &&
    pathname !== "/forgot-password" &&
    pathname !== "/reset-password" &&
    pathname !== "/verification"
  ) {
    return <LoadingScreenPage />;
  }

  return children;
};
