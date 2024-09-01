"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AccountDetailView from "@/components/features/accounts/view/detail/account-detail.view";
import LoadingScreen from "@/components/features/accounts/view/loadingScreen";
import { PAGE } from "@/const/pages";
import useAuth from "@/hooks/useAuth";
import { isAdmin, permissionPageView } from "@/utils/helper";

export default function AccountsDetail() {
  const [isSSR, setIsSSR] = useState(true);
  const { user } = useAuth();
  const route = useRouter();
  const { slug } = useParams();

  useEffect(() => {
    setIsSSR(false);
  }, []);

  // useEffect(() => {
  //   if (!permissionPageView(PAGE.ACCOUNT.NAME, user?.role)) {
  //     route.push(PAGE.DASHBOARD.ROUTE);
  //   } else if (!isAdmin(user?.role) && slug[0] !== user?.id) {
  //     route.push(PAGE.DASHBOARD.ROUTE);
  //   }
  // }, [user, route]);

  return (
    <>
      {!isSSR && (
        <>
          <AccountDetailView />
        </>
      )}
    </>
  );
}
