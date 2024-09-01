import ReportsView from "@/components/features/reports/view/report.view";
import React, { Suspense } from "react";
export const metadata = {
  title: "Reports - Globotix Fleet Management",
  description: "Reports - Globotix Fleet Management",
};
const ReportsPage = () => {
  return (
    <Suspense>
      <ReportsView />
    </Suspense>
  );
};

export default ReportsPage;
