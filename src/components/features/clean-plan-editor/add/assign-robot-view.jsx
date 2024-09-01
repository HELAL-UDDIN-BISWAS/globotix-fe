import Button from "@/components/common/button";
import { Icons, Image } from "@/components/ui/images";
import { Text } from "@/components/ui/typo";
import useRobotsList from "@/hooks/useRobotsList";
import { cn } from "@/utils/cn";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { useState } from "react";

const AssignRobotView = ({
  selectedZoneToClean,
  selectedZoneToBlock,
  selectedRobot,
  setSelectedRobot,
  createHandler,
}) => {
  const robots = useRobotsList();

  const tabItem = [
    {
      label: "Selected Robots",
      value: "selected",
    },
    {
      label: "All Robots",
      value: "all",
    },
  ];
  const [selectedTab, setSelectedTab] = useState(tabItem[0].value);

  return (
    <Box className="p-4 h-full">
      {/* Tab */}
      <Grid
        columns="2"
        className="border rounded-md divide-x border-placeholder divide-placeholder"
      >
        {tabItem.map((item, index) => {
          return (
            <Flex
              className={cn(
                selectedTab == item.value
                  ? "bg-primary text-white"
                  : "text-placeholder",
                "p-2  text-sm"
              )}
              align="center"
              justify="center"
              key={index}
              onClick={() => setSelectedTab(item.value)}
            >
              {item.value != "all"
                ? `${item.label} (${selectedRobot.length})`
                : `${item.label}`}
            </Flex>
          );
        })}
      </Grid>

      <Flex direction="column" justify="between" className="h-full pb-10">
        <Box className="py-4">
          {selectedTab == tabItem[1].value ? (
            <Box>
              {robots.data?.map((item, index) => {
                const existed = selectedRobot?.find(
                  (robot) => robot.id == item.id
                );
                return (
                  <Box className="relative mb-2" key={index}>
                    <Flex
                      align="center"
                      className={cn(
                        existed ? "border-primary" : "border-black",
                        "border-2  rounded-md p-1"
                      )}
                      gap="2"
                      onClick={() => {
                        if (existed) {
                        } else {
                          setSelectedRobot([...selectedRobot, item]);
                        }
                      }}
                    >
                      <Image
                        src={"/upload/images/img_robot_yellow.png"}
                        alt="robot"
                        width={74}
                        height={74}
                        className={"w-[74px] h-[74px] rounded-md"}
                      />
                      <Text className="text-base font-semibold">
                        {item.attributes.displayName}
                      </Text>
                    </Flex>
                    {existed && (
                      <Box
                        onClick={() =>
                          setSelectedRobot(
                            selectedRobot.filter(
                              (robot) => robot.id !== item.id
                            )
                          )
                        }
                      >
                        <Icons.close className="absolute top-2 right-2 w-5 h-5 text-primary " />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box>
              {selectedRobot?.map((item, index) => {
                const existed = selectedRobot?.find(
                  (robot) => robot.id == item.id
                );
                return (
                  <Box className="relative mb-2" key={index}>
                    <Flex
                      align="center"
                      className={cn(
                        existed ? "border-primary" : "border-black",
                        "border-2  rounded-md p-1"
                      )}
                      gap="2"
                      onClick={() => setSelectedRobot([...selectedRobot, item])}
                    >
                      <Image
                        src={"/upload/images/img_robot_yellow.png"}
                        alt="robot"
                        width={74}
                        height={74}
                        className={"w-[74px] h-[74px] rounded-md"}
                      />
                      <Text className="text-base font-semibold">
                        {item.attributes.displayName}
                      </Text>
                    </Flex>
                    {existed && (
                      <Box
                        onClick={() =>
                          setSelectedRobot(
                            selectedRobot.filter(
                              (robot) => robot.id !== item.id
                            )
                          )
                        }
                      >
                        <Icons.close className="absolute top-2 right-2 w-5 h-5 text-primary " />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
        <Flex justify="end">
          <Button
            onClick={createHandler}
            disabled={
              selectedZoneToClean.length == 0 && selectedZoneToBlock.length == 0
            }
          >
            <Text className="text-white">Create</Text>
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
export default AssignRobotView;
