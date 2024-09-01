"use client";
import LoadingScreen from "@/components/features/accounts/view/loadingScreen";
import RobotBaseAddView from "@/components/features/robots/view/add/robot-base-add.view";
import { PAGE } from "@/const/pages";
import useAuth from "@/hooks/useAuth";
import { permissionPageView } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RobotBaseAddPage() {
  const [isSSR, setIsSSR] = useState(true);
  const { user } = useAuth();
  const route = useRouter();

  useEffect(() => {
    setIsSSR(false);
  }, []);

  useEffect(() => {
    if (!permissionPageView(PAGE.ROBOT_CREATE.NAME, user?.role)) {
      route.push(PAGE.DASHBOARD.ROUTE);
    }
  }, [user]);

  return (
    <>
      {!isSSR && (
        <>
          {permissionPageView(PAGE.ROBOT_CREATE.NAME, user?.role) ? (
            <RobotBaseAddView />
          ) : (
            <LoadingScreen />
          )}
        </>
      )}
    </>
  );
}
