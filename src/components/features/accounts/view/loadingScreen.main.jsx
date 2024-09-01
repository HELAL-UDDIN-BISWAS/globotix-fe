"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const LoadingScreen = () => {
  const route = useRouter();
  const [isSSR, setIsSSR] = useState(true);
  const { user, isAuthenticated, loading } = useAuth();
  useEffect(() => {
    setIsSSR(false);
    if (!isAuthenticated) {
      route.push("/login");
    }
  }, []);

  return (
    <>
      {!isSSR && (
        <div className="text-black font-2x font-bold w-screen h-screen flex justify-center items-center">
          LOADING...
        </div>
      )}
    </>
  );
};

export default LoadingScreen;
