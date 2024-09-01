import { Text } from "@/components/ui/typo";
import { cn } from "@/utils/cn";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import Button from "@/components/common/button";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/components/button/SecondaryButton";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const SelectedZoneView = ({
  selectedZoneToClean = [],
  setSelectedZoneToClean,
  selectedZoneToBlock = [],
  setSelectedZoneToBlock,
  setRemoveZone,
  setUnselectZone,
  selectedRobot,
  createHandler,
  editEnable,
  setEditEnable,
  name = "",
}) => {
  const router = useRouter();
  const tabItem = [
    {
      label: "Zone to Clean",
      value: "clean",
      count: selectedZoneToClean.length,
    },
    // {
    //   label: "Zone to Block",
    //   value: "block",
    //   count: selectedZoneToBlock.length,
    // },
  ];

  const [selectedTab, setSelectedTab] = useState(tabItem[0].value);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => (event) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index) => (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (index) => (event) => {
    event.preventDefault();
    if (draggedIndex === null) return;

    const newSelectedZoneToClean = [...selectedZoneToClean];
    const [draggedItem] = newSelectedZoneToClean.splice(draggedIndex, 1);
    newSelectedZoneToClean.splice(index, 0, draggedItem);

    setSelectedZoneToClean(newSelectedZoneToClean);
    props.onChange(newSelectedZoneToClean);

    setDraggedIndex(null);
  };

  const handleDropBlock = (index) => (event) => {
    event.preventDefault();
    if (draggedIndex === null) return;

    const newSelectedZoneToClean = [...selectedZoneToBlock];
    const [draggedItem] = newSelectedZoneToClean.splice(draggedIndex, 1);
    newSelectedZoneToClean.splice(index, 0, draggedItem);

    setSelectedZoneToBlock(newSelectedZoneToClean);
    props.onChange(newSelectedZoneToClean);

    setDraggedIndex(null);
  };

  const NoSelectView = () => {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="h-full py-4"
      >
        <Image
          src="/upload/images/no_result.png"
          alt="Result Image"
          width="300"
          height="200"
          full
        />
        <Text className="font-semibold">No Selected Item</Text>
      </Flex>
    );
  };

  return (
    <Box className="p-4 h-full">
      {/* Tab */}
      <Grid className="border rounded-md divide-x border-placeholder divide-placeholder">
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
              {`${item.label} (${item.count})`}
            </Flex>
          );
        })}
      </Grid>
      {/* Content */}

      <Flex direction="column" justify="between" className="h-full pb-10">
        <Grid className="h-full">
          {selectedTab == tabItem[0].value ? (
            <Flex direction="column" gap="3" className="py-4 h-1[50}">
              {selectedZoneToClean.length == 0 ? (
                <NoSelectView />
              ) : (
                selectedZoneToClean.map((item, index) => (
                  <div
                    draggable
                    onDragStart={handleDragStart(index)}
                    onDragOver={handleDragOver(index)}
                    onDrop={handleDrop(index)}
                    className="mb-4"
                  >
                    <Flex align="center" gap="2">
                      <MdDragIndicator className="text-[20px]" />
                      <Box
                        className="w-full p-4 rounded-lg"
                        style={{ backgroundColor: item.color }}
                      >
                        <Flex
                          className="text-titleFontColor w-full font-semibold"
                          align="center"
                          justify="between"
                        >
                          <Text className="text-[18px]">{item.title}</Text>
                          {editEnable && (
                            <Box onClick={() => setUnselectZone(item)}>
                              <IoMdClose />
                            </Box>
                          )}
                        </Flex>
                        <Text className="text-titleFontColor text-xs pt-[5px]">
                          Vacuum {item.vacuum}, Roller {item.roller}, Gutter{" "}
                          {item.gutter}, Repeat {item.repeat}
                        </Text>
                      </Box>
                    </Flex>
                  </div>
                ))
              )}
            </Flex>
          ) : (
            <Box className="py-4">
              {selectedZoneToBlock.length == 0 ? (
                <NoSelectView />
              ) : (
                selectedZoneToBlock.map((item, index) => (
                  <Flex
                    align="center"
                    gap="2"
                    key={index}
                    className="mb-2"
                    draggable
                    onDragStart={handleDragStart(index)}
                    onDragOver={handleDragOver(index)}
                    onDrop={handleDropBlock(index)}
                  >
                    <MdDragIndicator className="text-[20px]" />
                    <Box className="w-full p-4 bg-btnColor rounded-lg">
                      <Flex
                        className="text-titleFontColor w-full font-semibold"
                        align="center"
                        justify="between"
                      >
                        <Text className="text-[18px]">{item.title}</Text>
                        {editEnable && (
                          <Box onClick={() => setRemoveZone(item)}>
                            <IoMdClose />
                          </Box>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                ))
              )}
            </Box>
          )}
        </Grid>

        {editEnable && (
          <Flex justify="end" gap="2">
            <SecondaryButton onClick={() => window.location.reload()}>
              <Text className="text-primary">Cancel</Text>
            </SecondaryButton>
            <Button
              onClick={createHandler}
              disabled={
                (selectedZoneToClean.length == 0 &&
                  selectedZoneToBlock.length == 0) ||
                !name
              }
            >
              <Text className="text-white">Update</Text>
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
export default SelectedZoneView;
