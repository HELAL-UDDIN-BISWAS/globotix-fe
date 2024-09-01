"use client";
import Page from "@/components/layout/page";
import { FaChevronLeft } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import useRobots from "@/hooks/useRobots";
import LiveZoneView from "./live-zone-view";
// import useZonesByLocation from "@/hooks/useZonesByLocation";
// import useCleaningPlanEditor from "@/hooks/useCleaningPlanEditor";
// import StreamedZoneView from "./selected-zone-view";

const BotLiveMonitoringView = () => {
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
      console.log("Live-monitoring-view-id", id);
      await getRobotById({ id: id });
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  console.log("Robot for live monitoring...", robot);

  useEffect(() => {
    !!robot && setSelectedRobot(robot);
  }, [robot]);

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
              {"Live Streaming "}
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
        {selectedRobot != null && (
          <LiveZoneView
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
export default BotLiveMonitoringView;
