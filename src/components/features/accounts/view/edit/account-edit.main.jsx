"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AccountEditView from "@/components/features/accounts/view/edit/account-edit.view";
import LoadingScreen from "@/components/features/accounts/view/loadingScreen";
import { PAGE } from "@/const/pages";
import useAuth from "@/hooks/useAuth";
import { permissionPageView } from "@/utils/helper";

export default function AccountEditPage() {
  const [isSSR, setIsSSR] = useState(true);
  const { user } = useAuth();
  const route = useRouter();
  const { slug } = useParams();

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
          {" "}
          {permissionPageView(PAGE.ACCOUNT.NAME, user?.role) ||
          slug[0] == user?.id ? (
            <AccountEditView />
          ) : (
            <LoadingScreen />
          )}
        </>
      )}
    </>
  );
}
