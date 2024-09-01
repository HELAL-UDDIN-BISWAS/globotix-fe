"use client";
import { Box } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ZoneSelectMainView from "./zone-select-main.view";
import CleaningPlanAddView from "./cleaning-plan-add.view";

const CleaningPlanEditorAddView = () => {
  const searchParams = useSearchParams();
  const step = searchParams.get("mode");
  const [planDetail, setPlanDetail] = useState({
    name: "",
    building: "",
    location: "",
  });

  return (
    <Box>
      {step == "detail" ? (
        <CleaningPlanAddView
          planDetail={planDetail}
          setPlanDetail={setPlanDetail}
        />
      ) : (
        <ZoneSelectMainView planDetail={planDetail} />
      )}
    </Box>
  );
};
export default CleaningPlanEditorAddView;
