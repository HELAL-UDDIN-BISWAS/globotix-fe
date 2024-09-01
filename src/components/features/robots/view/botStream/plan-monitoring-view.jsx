"use client";
import Page from "@/components/layout/page";
import { FaChevronLeft } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import useRobots from "@/hooks/useRobots";
import PlanZoneView from "./plan-zone-view";
// import useZonesByLocation from "@/hooks/useZonesByLocation";
// import useCleaningPlanEditor from "@/hooks/useCleaningPlanEditor";
// import StreamedZoneView from "./selected-zone-view";

const BotPlanMonitoringView = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { getRobotById, robot } = useRobots();
  const [selectedZoneToClean, setSelectedZoneToClean] = useState([]);
  const [selectedZoneToBlock, setSelectedZoneToBlock] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [editEnable, setEditEnable] = useState(false);

  const fetchData = useCallback(async () => {
    if (!!id) {
      console.log("Plan-monitoring-view-id", id);
      await getRobotById({ id: id });
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    !!robot && setSelectedRobot(robot);
  }, [robot]);
  console.log("Robot for plan monitoring...", robot);
  return (
    <>
      <Page
        title={
          <div className="flex items-center gap-4 ">
            <FaChevronLeft
              color="text-primary"
              className="cursor-pointer"
              onClick={() => {
                setGoBack(true);
                router?.back();
              }}
            />

            <span className="text-titleFontColor w-full text-lg font-semibold">
              {"Past Streaming "}
            </span>
            <FaChevronLeft
              color="text-primary"
              className="cursor-pointer"
              onClick={() => {
                router?.back();
              }}
            />

            <span className="text-titleFontColor w-full text-lg font-semibold">
              {robot?.displayName}
            </span>
          </div>
        }
      >
        {/* <div className="mt-[100px]">History Monitoring View Page</div> */}
        {selectedRobot != null && (
          <PlanZoneView
            selectedZoneToClean={selectedZoneToClean}
            setSelectedZoneToClean={setSelectedZoneToClean}
            selectedZoneToBlock={selectedZoneToBlock}
            setSelectedZoneToBlock={setSelectedZoneToBlock}
            // planDetail={planDetail}
            // setPlanDetail={setPlanDetail}
            successOpen={successOpen}
            setSuccessOpen={setSuccessOpen}
            defaultRobot={selectedRobot}
            editEnable={editEnable}
            setEditEnable={setEditEnable}
            id={id}
            name={selectedRobot?.name}
            isGoBack={goBack}
          />
        )}
      </Page>
    </>
  );
};
export default BotPlanMonitoringView;
