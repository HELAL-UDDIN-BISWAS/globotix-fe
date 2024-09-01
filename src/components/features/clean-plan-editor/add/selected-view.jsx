import { Box, Flex } from "@radix-ui/themes";
import IconBuildingGray from "../../../../../public/upload/icons/iconBuildingGray";
import IconRobotGray from "../../../../../public/upload/icons/iconRobotGray";
import { cn } from "@/utils/cn";
import { useState } from "react";
import SelectedZoneView from "./selected-zone-view";
import Button from "@/components/common/button";
import { Text } from "@/components/ui/typo";
import AssignRobotView from "./assign-robot-view";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { CREATE_CLEANING_PLAN_EDITOR } from "@/graphql/mutation/cleaning-plan";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const SelectedView = ({
  selectedZoneToClean,
  selectedZoneToBlock,
  setSelectedZoneToClean,
  setSelectedZoneToBlock,
  setRemoveZone,
  setUnselectZone,
  planDetail,
  successOpen,
  setSuccessOpen,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [selectedTab, setSelectedTab] = useState("building");
  const [selectedRobot, setSelectedRobot] = useState([]);

  const [createCleanPlanEditorAction] = useMutation(
    CREATE_CLEANING_PLAN_EDITOR,
    {
      client: apolloClient,
      onCompleted: (data) => {
        if (from == "schedule") {
          const storedData = sessionStorage.getItem("scheduleFormData");
          const parsedData = JSON.parse(storedData);
          const newSession = {
            ...parsedData,
            planId: data?.createCleaningPlanEditor?.data?.id,
            cleaningPlan:
              data?.createCleaningPlanEditor?.data?.attributes?.name,
          };
          sessionStorage.setItem(
            "scheduleFormData",
            JSON.stringify(newSession)
          );
          router.push("/schedule/add?from=plan-create");
        } else {
          router.push("/cleaning-plan");
          setSuccessOpen(true);
        }
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  const createHandler = async () => {
    const cleanZones = selectedZoneToClean?.map((item) => {
      return {
        zone: item.id,
        vacuum: parseInt(item.vacuum),
        roller: parseInt(item.roller),
        gutter: parseInt(item.gutter),
        repeat: parseInt(item.repeat),
        color: item.color,
      };
    });
    await createCleanPlanEditorAction({
      variables: {
        data: {
          name: planDetail.name,
          location: planDetail.location,
          building: planDetail.building,
          CleanZones: cleanZones,
          BlockZones: selectedZoneToBlock.map((item) => {
            return { zone: item.id };
          }),
          robots: selectedRobot.map((item) => parseInt(item.id)),
          createdByUser: user?.id,
        },
      },
    });
  };

  return (
    <Box className="h-full">
      <Flex className="h-[50px]">
        <Box
          className={cn(
            selectedTab == "building" ? "bg-white rounded-t-lg" : " ",
            "py-3 px-8 cursor-pointer"
          )}
          onClick={() => setSelectedTab("building")}
        >
          <IconBuildingGray />
        </Box>
        <Box
          className={cn(
            selectedTab == "robot" ? "bg-white rounded-t-lg" : " ",
            "py-3 px-8 cursor-pointer"
          )}
          onClick={() => setSelectedTab("robot")}
        >
          <IconRobotGray />
        </Box>
      </Flex>
      <Box className="shadow rounded-b-xl bg-white h-full">
        {selectedTab == "building" ? (
          <SelectedZoneView
            selectedZoneToClean={selectedZoneToClean}
            selectedZoneToBlock={selectedZoneToBlock}
            setSelectedZoneToClean={setSelectedZoneToClean}
            setSelectedZoneToBlock={setSelectedZoneToBlock}
            setRemoveZone={setRemoveZone}
            setUnselectZone={setUnselectZone}
            createHandler={createHandler}
            selectedRobot={selectedRobot}
          />
        ) : (
          <AssignRobotView
            selectedZoneToClean={selectedZoneToClean}
            selectedZoneToBlock={selectedZoneToBlock}
            createHandler={createHandler}
            selectedRobot={selectedRobot}
            setSelectedRobot={setSelectedRobot}
          />
        )}
      </Box>
    </Box>
  );
};
export default SelectedView;
