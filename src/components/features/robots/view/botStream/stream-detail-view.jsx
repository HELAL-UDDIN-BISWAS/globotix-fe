"use client";
import Page from "@/components/layout/page";
import { FaChevronLeft } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useZonesByLocation from "@/hooks/useZonesByLocation";
import useCleaningPlanEditor from "@/hooks/useCleaningPlanEditor";
import StreamedZoneView from "./selected-zone-view";

const BotStreamDetailView = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [selectedZoneToClean, setSelectedZoneToClean] = useState([]);
  const [selectedZoneToBlock, setSelectedZoneToBlock] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [editEnable, setEditEnable] = useState(false);
  const [name, setName] = useState("");

  const [planDetail, setPlanDetail] = useState({
    name: "",
    building: "",
    location: "",
  });

  const { getCleaningPlanByID, plan } = useCleaningPlanEditor();

  useEffect(() => {
    if (id) {
      getCleaningPlanByID(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (plan) {
      setSelectedZoneToBlock(plan?.blockZones);
      setSelectedZoneToClean(plan?.cleanZones);
      setSelectedRobot(plan?.robots);
      setPlanDetail({
        name: plan?.name,
        location: plan?.location,
        building: plan?.building,
        robot: plan?.robots[0] || null,
      });
      setName(plan?.name);
    }
  }, [plan]);

  const { getZoneByLocation, getLocationByID } = useZonesByLocation();

  const fetchZones = async () => {
    await getZoneByLocation(parseInt(planDetail?.location));
    await getLocationByID(parseInt(planDetail?.location));
  };

  useEffect(() => {
    if (planDetail.location != "") {
      fetchZones();
    }
  }, [planDetail]);

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
              {"Bot Stream "}
            </span>
            <FaChevronLeft
              color="text-primary"
              className="cursor-pointer"
              onClick={() => {
                router?.back();
              }}
            />

            <span className="text-titleFontColor w-full text-lg font-semibold">
              {"Bot 1 "}
            </span>
          </div>
        }
      >
        <StreamedZoneView
          selectedZoneToClean={selectedZoneToClean}
          setSelectedZoneToClean={setSelectedZoneToClean}
          selectedZoneToBlock={selectedZoneToBlock}
          setSelectedZoneToBlock={setSelectedZoneToBlock}
          planDetail={planDetail}
          successOpen={successOpen}
          setSuccessOpen={setSuccessOpen}
          defaultRobot={selectedRobot}
          editEnable={editEnable}
          setEditEnable={setEditEnable}
          id={id}
          name={name}
          isGoBack={goBack}
        />
      </Page>
    </>
  );
};
export default BotStreamDetailView;
