"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import LoadingScreen from "@/components/features/accounts/view/loadingScreen";
import LoginView from "@/components/features/auth/login/view/login.view";
import { PAGE } from "@/const/pages";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const route = useRouter();
  const [isSSR, setIsSSR] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      route.push(PAGE.DASHBOARD.ROUTE);
    } else {
      setIsSSR(false);
    }
  }, [isAuthenticated]);

  return <>{!isSSR && !isAuthenticated ? <LoginView /> : <LoadingScreen />}</>;
}
