import { Box, Flex } from "@radix-ui/themes";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import SelectedZoneView from "./selected-zone-view";
import AssignRobotView from "./assign-robot-view";
import { useMutation } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { UPDATE_CLEANING_PLAN_EDITOR } from "@/graphql/mutation/cleaning-plan";
import IconBuildingGray from "../../../../../../public/upload/icons/iconBuildingGray";
import IconRobotGray from "../../../../../../public/upload/icons/iconRobotGray";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const SelectedView = ({
  selectedZoneToClean,
  selectedZoneToBlock,
  setSelectedZoneToClean,
  setSelectedZoneToBlock,
  setRemoveZone,
  setUnselectZone,
  planDetail,
  setSuccessOpen,
  defaultRobot,
  id,
  editEnable,
  setEditEnable,
  name,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("building");
  const [selectedRobot, setSelectedRobot] = useState([]);

  useEffect(() => {
    if (defaultRobot) {
      setSelectedRobot(defaultRobot);
    }
  }, [defaultRobot]);

  const [createCleanPlanEditorAction] = useMutation(
    UPDATE_CLEANING_PLAN_EDITOR,
    {
      client: apolloClient,
      onCompleted: () => {
        router.push("/cleaning-plan");
        setSuccessOpen(true);
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
        id: id,
        data: {
          name: name,
          CleanZones: cleanZones,
          BlockZones: selectedZoneToBlock.map((item) => {
            return { zone: item.id };
          }),
          robots: selectedRobot.map((item) => parseInt(item.id)),
          modifiedByUser: user?.id,
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
            editEnable={editEnable}
            setEditEnable={setEditEnable}
            name={name}
          />
        ) : (
          <AssignRobotView
            selectedZoneToClean={selectedZoneToClean}
            selectedZoneToBlock={selectedZoneToBlock}
            createHandler={createHandler}
            selectedRobot={selectedRobot}
            setSelectedRobot={setSelectedRobot}
            editEnable={editEnable}
            setEditEnable={setEditEnable}
            name={name}
          />
        )}
      </Box>
    </Box>
  );
};
export default SelectedView;
