"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AccountAddView from "@/components/features/accounts/view/add/account-add.view";
import LoadingScreen from "@/components/features/accounts/view/loadingScreen";
import { PAGE } from "@/const/pages";
import useAuth from "@/hooks/useAuth";
import { permissionPageView } from "@/utils/helper";

export default function AccountsDetailPage() {
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
            <AccountAddView />
          ) : (
            <LoadingScreen />
          )}
        </>
      )}
    </>
  );
}
