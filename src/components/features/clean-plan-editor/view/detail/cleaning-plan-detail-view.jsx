"use client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import ZoneView from "./zone-view";
import Page from "@/components/layout/page";
import { FaChevronLeft } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useZonesByLocation from "@/hooks/useZonesByLocation";
import SuccessModal from "@/components/modal/success.modal";
import SelectedView from "./selected-view";
import { MdOutlineEdit } from "react-icons/md";
import useCleaningPlanEditor from "@/hooks/useCleaningPlanEditor";

import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
import TextInput from "@/components/form/text.input";
import { Text } from "@/components/ui/typo";
const socket = io(API_URL, { transport: ["websocket"] });

const CleaningPlanDetailView = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [selectedZoneToClean, setSelectedZoneToClean] = useState([]);
  const [selectedZoneToBlock, setSelectedZoneToBlock] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [removeZone, setRemoveZone] = useState();
  const [unselectZone, setUnselectZone] = useState();
  const [editEnable, setEditEnable] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [planDetail, setPlanDetail] = useState({
    name: "",
    building: "",
    location: "",
  });

  const { getCleaningPlanByID, plan } = useCleaningPlanEditor();

  // socket.on("robot-flexadev-queue", (arg) => {
  //   if (arg.table_name === "cleaning-plan-editor") {
  //     getCleaningPlanByID(parseInt(id));
  //   }
  //   if (arg.table_name === "zone") {
  //     if (planDetail?.location != "") {
  //       fetchZones();
  //     }
  //   }
  // });

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
      });
      setName(plan?.name);
    }
  }, [plan]);

  const { getZoneByLocation, getLocationByID } = useZonesByLocation();

  const fetchZones = async () => {
    await getZoneByLocation(parseInt(planDetail?.location));
    await getLocationByID(parseInt(planDetail?.location));
    setLoading(false);
  };

  useEffect(() => {
    if (planDetail.location != "") {
      fetchZones();
    }
  }, [planDetail]);

  return (
    <>
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        onBack={() => router?.back()}
        text={"View All Cleaning Plan"}
        successText={" Cleaning Plan Updated"}
      />
      <Page
        title={
          <div className="flex items-center gap-4">
            <FaChevronLeft
              color="text-primary"
              className="cursor-pointer"
              onClick={() => {
                router?.back();
              }}
            />
            <span className="text-titleFontColor w-full text-lg font-semibold">
              {name ?? ""}
            </span>
            {!editEnable && (
              <Flex gap="1" onClick={() => setEditEnable(!editEnable)}>
                <MdOutlineEdit className="cursor-pointer text-blue-1 w-6 h-6" />
                <span className="text-blue-1 w-full text-base font-semibold">
                  Edit
                </span>
              </Flex>
            )}
          </div>
        }
      >
        {editEnable && (
          <input
            autoComplete={false}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`
              bg-white ml-4
            relative z-10 w-[400px] text-sm text-black-1 border-2 border-white-1 rounded-[10px] h-[45px] py-[12px] px-[15px] focus:outline-none`}
            placeholder={"Enter Cleaning Plan Name"}
          />
        )}
        {loading ? (
          <Text className="font-semibold p-4">Loading...</Text>
        ) : (
          <Grid columns="3" gap="4" className="p-4 bg-white-2 h-full">
            <Box className="col-span-2 shadow h-full rounded-xl bg-white">
              <ZoneView
                selectedZoneToClean={selectedZoneToClean}
                setSelectedZoneToClean={setSelectedZoneToClean}
                selectedZoneToBlock={selectedZoneToBlock}
                setSelectedZoneToBlock={setSelectedZoneToBlock}
                removeZone={removeZone}
                setRemoveZone={setRemoveZone}
                unselectZone={unselectZone}
                setUnselectZone={setUnselectZone}
                editEnable={editEnable}
                setEditEnable={setEditEnable}
                planDetail={planDetail}
              />
            </Box>
            <Box className="h-full">
              <SelectedView
                selectedZoneToClean={selectedZoneToClean}
                setSelectedZoneToClean={setSelectedZoneToClean}
                selectedZoneToBlock={selectedZoneToBlock}
                setSelectedZoneToBlock={setSelectedZoneToBlock}
                setRemoveZone={setRemoveZone}
                setUnselectZone={setUnselectZone}
                planDetail={planDetail}
                successOpen={successOpen}
                setSuccessOpen={setSuccessOpen}
                defaultRobot={selectedRobot}
                editEnable={editEnable}
                setEditEnable={setEditEnable}
                id={id}
                name={name}
              />
            </Box>
          </Grid>
        )}
      </Page>
    </>
  );
};
export default CleaningPlanDetailView;
