"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AccountsView from "@/components/features/accounts/view/accounts.view";
import LoadingScreen from "@/components/features/accounts/view/loadingScreen";
import { PAGE } from "@/const/pages";
import useAuth from "@/hooks/useAuth";
import { permissionPageView } from "@/utils/helper";

export default function AccountsPage() {
  const [isSSR, setIsSSR] = useState(true);
  const { user } = useAuth();
  const route = useRouter();

  useEffect(() => {
    setIsSSR(false);
  }, []);

  useEffect(() => {
    if (!permissionPageView(PAGE.ACCOUNT.NAME, user?.role)) {
      route.push(PAGE.DASHBOARD.ROUTE);
    }
  }, [user]);

  return (
    <>
      {!isSSR && (
        <>
          {permissionPageView(PAGE.ACCOUNT.NAME, user?.role) ? (
            <AccountsView />
          ) : (
            <LoadingScreen />
          )}
        </>
      )}
    </>
  );
}
