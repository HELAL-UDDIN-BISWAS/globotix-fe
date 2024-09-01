"use client";
import { Box, Grid } from "@radix-ui/themes";
import ZoneView from "./zone-view";
import Page from "@/components/layout/page";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useZonesByLocation from "@/hooks/useZonesByLocation";
import SuccessModal from "@/components/modal/success.modal";
import SelectedView from "./selected-view";

import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
const socket = io(API_URL, { transport: ["websocket"] });

const ZoneSelectMainView = ({ planDetail }) => {
  const router = useRouter();

  const [selectedZoneToClean, setSelectedZoneToClean] = useState([]);
  const [selectedZoneToBlock, setSelectedZoneToBlock] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [removeZone, setRemoveZone] = useState();
  const [unselectZone, setUnselectZone] = useState();

  const { getZoneByLocation, getLocationByID } = useZonesByLocation();

  const fetchZones = async () => {
    await getZoneByLocation(parseInt(planDetail?.location));
    await getLocationByID(parseInt(planDetail?.location));
  };

  socket.on("robot-flexadev-queue", (arg) => {
    if (arg.table_name === "zone") {
      if (planDetail?.location) {
        fetchZones();
      }
    }
  });

  useEffect(() => {
    if (planDetail.location) {
      fetchZones();
    } else {
      router.back();
    }
  }, [planDetail]);

  return (
    <>
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        onBack={() => router?.back()}
        text={"View All Cleaning Plan"}
        successText={"New Cleaning Plan Added"}
      />
      <Page
        title={
          <div className="flex items-center gap-4">
            <FaChevronLeft
              color="text-primary"
              className="cursor-pointer"
              onClick={() => {
                router.back();
              }}
            />
            <span className="text-titleFontColor w-full text-lg font-semibold">
              New Cleaning Plan
            </span>
          </div>
        }
      >
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
            />
          </Box>
          <Box className="h-full">
            <SelectedView
              selectedZoneToClean={selectedZoneToClean}
              selectedZoneToBlock={selectedZoneToBlock}
              setSelectedZoneToClean={setSelectedZoneToClean}
              setSelectedZoneToBlock={setSelectedZoneToBlock}
              setRemoveZone={setRemoveZone}
              setUnselectZone={setUnselectZone}
              planDetail={planDetail}
              successOpen={successOpen}
              setSuccessOpen={setSuccessOpen}
            />
          </Box>
        </Grid>
      </Page>
    </>
  );
};
export default ZoneSelectMainView;
