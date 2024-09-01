"use client";
import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { useRouter } from "next/navigation";
import Button from "@/components/common/button";
import { Text } from "@/components/ui/typo";
import useCleaningPlanEditor from "@/hooks/useCleaningPlanEditor";
import { Box, Flex, Grid } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/utils/cn";
import SecondaryButton from "@/components/button/SecondaryButton";
import toast from "react-hot-toast";
import useZonesByLocation from "@/hooks/useZonesByLocation";
import { resizedCanvasWidthHeight } from "@/utils/canva/resizedCanvasWidthHeight";
import { rosToGlobalPoints } from "@/utils/canva/manipulatePoint";
import { STORAGE_URL } from "@/lib/api";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdOutlineInfo } from "react-icons/md";

const vacuumItems = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];
const rollerItems = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];
const gutterItems = [
  { label: "0", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];
const repeatItems = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];
const ZoneViewPage = ({
  selectedZoneToClean,
  setSelectedZoneToClean,
  selectedZoneToBlock,
  setSelectedZoneToBlock,
  removeZone,
  setRemoveZone,
  unselectZone,
  setUnselectZone,
}) => {
  const router = useRouter();
  const [canvas, setCanvas] = useState(null);
  const [tipShow, setTipShow] = useState(false);
  const [selected, setSelected] = useState();
  const [configureModalOpen, setConfigureModalOpen] = useState(false);
  const [chooseModalOpen, setChooseModalOpen] = useState(false);
  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [unselectModalOpen, setUnselectModalOpen] = useState(false);
  const [vacuum, setVacuum] = useState(0);
  const [roller, setRoller] = useState(0);
  const [gutter, setGutter] = useState(0);
  const [repeat, setRepeat] = useState(1);
  const [dragEnable, setDragEnable] = useState(true);

  const canvasWidth = 800;
  const canvasHeight = 600;

  const { locationZones, locationByID } = useZonesByLocation();

  useEffect(() => {
    if (locationByID) {
      let { updatedCanvasWidth, updatedCanvasHeight } =
        resizedCanvasWidthHeight(
          locationByID?.map.width,
          locationByID?.map.height,
          canvasWidth,
          canvasHeight,
          window.innerWidth
        );

      const c = new fabric.Canvas("canvas", {
        height: updatedCanvasHeight,
        width: updatedCanvasWidth,
        backgroundColor: "white",
        centeredScaling: false,
        rotationCursor: false,
        selection: false,
        selectionColor: "#5842C333",
        selectionBorderColor: "#5842C3",
        cornerColor: "#BFA01D",
        uniformScaling: false,
      });

      if (locationByID?.map.url) {
        fabric.Image.fromURL(STORAGE_URL + locationByID?.map.url, (img) => {
          c?.setBackgroundImage(img, c.renderAll.bind(c), {
            scaleX: updatedCanvasWidth / locationByID?.map.width,
            scaleY: updatedCanvasHeight / locationByID?.map.height,
          });
        });
      }

      setCanvas(c);

      return () => {
        c.dispose();
      };
    }
  }, [locationByID, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (canvas) {
      canvas.clear();
      renderPolygons();
      canvas.off("mouse:wheel");
    }
  }, [canvas, locationZones]);

  const renderPolygons = () => {
    locationZones.forEach((zone) => {
      const reScaleHZPoints = rosToGlobalPoints(
        zone.points,
        locationByID?.map,
        canvas,
        "other",
        locationByID?.mapMetaData
      );

      const poly = new fabric.Polygon(reScaleHZPoints, {
        fill: "#D9D9D933",
        stroke: "#D9D9D9",
        strokeWidth: 1,
        scaleX: 1,
        scaleY: 1,
        objectCaching: false,
        transparentCorners: false,
        cornerColor: "#BFA01D",
        title: zone.title,
        id: zone.id,
        color: "white",
        lockRotation: true,
        selectable: true,
        lockSkewingX: true,
        lockSkewingY: true,
        lockScalingFlip: true,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: true, // Prevent horizontal dragging
        lockMovementY: true, // Prevent vertical dragging
      });

      if (canvas) {
        canvas.add(poly);
      }
      addTitleToPolygon(poly, zone.title); // Add title to polygon
    });
  };

  const addTitleToPolygon = (polygon, title) => {
    const text = new fabric.Text(title, {
      left: polygon.left + (polygon.width * polygon.scaleX) / 2,
      top: polygon.top + (polygon.height * polygon.scaleY) / 2,
      fontSize: 10,
      originX: "center",
      originY: "center",
      fill: "#7E6E3C",
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      selectable: false, // Make text unselectable
      evented: false, // Disable events on the text
    });

    canvas.add(text);
    canvas.bringToFront(text);
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.3; // 30% opacity
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const selectedToCleanHandler = () => {
    if (canvas) {
      const selectedObject = selected;
      const randomColor = getRandomColor();
      selectedObject.set({ fill: randomColor });
      if (selectedObject && selectedObject.type === "polygon") {
        const polygonDetails = {
          id: selectedObject.id,
          title: selectedObject.title,
          points: selectedObject.points,
          position: { left: selectedObject.left, top: selectedObject.top },
          selected: true,
          color: randomColor,
          vacuum: vacuum,
          roller: roller,
          gutter: gutter,
          repeat: repeat,
        };
        setSelectedZoneToClean([...selectedZoneToClean, polygonDetails]);
      }
    }
    setConfigureModalOpen(false);
  };

  useEffect(() => {
    if (canvas) canvas?.renderAll();
  }, [selectedZoneToClean, selectedZoneToBlock]);

  function findItemByID(canvas, id) {
    return canvas.getObjects().find((item) => item.id === id);
  }

  const unSelectedToCleanHandler = () => {
    const existingItem = findItemByID(canvas, unselectZone.id);
    const UpdateList = selectedZoneToClean.filter(
      (item) => item.id !== unselectZone.id
    );

    if (existingItem) {
      console.log("Item found on canvas:", existingItem);
      existingItem.set({
        fill: "#D9D9D933",
        stroke: "#D9D9D9",
        cornerColor: "#BFA01D",
        selectable: true,
      });
      setUnselectZone(null);
      setUnselectModalOpen(false);
      setSelectedZoneToClean(UpdateList);
    } else {
      console.log("Item found on canvas");
    }
  };

  const removeBlockHandler = () => {
    const existingItem = findItemByID(canvas, removeZone.id);
    const UpdateList = selectedZoneToBlock.filter(
      (item) => item.id !== removeZone.id
    );

    if (existingItem) {
      console.log("Item found on canvas:", existingItem);
      existingItem.set({
        fill: "#D9D9D933",
        stroke: "#D9D9D9",
        cornerColor: "#BFA01D",
        selectable: true,
      });
      setRemoveZone(null);
      setUnblockModalOpen(false);
      setSelectedZoneToBlock(UpdateList);
    } else {
      console.log("Item found on canvas");
    }
  };

  const chooseHandler = () => {
    const selectedObject = canvas.getActiveObject();
    if (selectedObject) {
      const selectedZone = [...selectedZoneToBlock, ...selectedZoneToClean];
      const existed = selectedZone.find((item) => {
        return item.id == selectedObject.id;
      });
      if (existed) {
        toast.error("existed");
      } else {
        setSelected(selectedObject);
        setChooseModalOpen(true);
      }
    } else {
      toast.error("please select one zone");
    }
  };

  function findTitleText(polygon) {
    let foundText = null;
    canvas.forEachObject(function (obj) {
      if (obj.type === "text" && obj.relatedObject === polygon) {
        foundText = obj;
      }
    });
    return foundText;
  }

  const selectedToBlockHandler = () => {
    if (canvas) {
      const selectedObject = selected;
      if (selectedObject) {
        selectedObject.set({
          fill: "#D6D6D6",
          selectable: false,
        });
        canvas.requestRenderAll();
        if (selectedObject.type === "polygon") {
          const polygonDetails = {
            id: selectedObject.id,
            title: selectedObject.title,
            points: selectedObject.points,
            position: { left: selectedObject.left, top: selectedObject.top },
            selected: true,
            color: "#D6D6D6",
          };
          setSelectedZoneToBlock([...selectedZoneToBlock, polygonDetails]);
        }
      }
      setChooseModalOpen(false);
    }
  };

  useEffect(() => {
    if (!!removeZone) {
      setUnblockModalOpen(true);
    }
  }, [removeZone]);

  useEffect(() => {
    if (!!unselectZone) {
      setUnselectModalOpen(true);
    }
  }, [unselectZone]);

  const zoomIn = () => {
    if (canvas) {
      let zoom = canvas.getZoom();
      zoom = zoom * 1.1; // Increase zoom level by 10%
      canvas.zoomToPoint(
        { x: canvas.getWidth() / 2, y: canvas.getHeight() / 2 },
        zoom
      );
    }
  };

  const zoomOut = () => {
    if (canvas) {
      let zoom = canvas.getZoom();
      zoom = zoom / 1.1; // Decrease zoom level by 10%
      canvas.zoomToPoint(
        { x: canvas.getWidth() / 2, y: canvas.getHeight() / 2 },
        zoom
      );
    }
  };

  useEffect(() => {
    if (canvas) {
      let isCmdPressed = false;
      let isCtrlPressed = false;

      const handleKeyDown = (event) => {
        if (event.key === "Meta" || event.key === "Alt") {
          isCmdPressed = true;
        }
        if (event.key === "Control") {
          isCtrlPressed = true;
        }
      };

      const handleKeyUp = (event) => {
        if (event.key === "Meta" || event.key === "Alt") {
          isCmdPressed = false;
        }
        if (event.key === "Control") {
          isCtrlPressed = false;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);

      const handleMouseWheel = (opt) => {
        opt.e.preventDefault();
        let e = opt.e;
        let delta = Math.sign(e.deltaY);
        let vpt = canvas.viewportTransform.slice(0);

        if (isCtrlPressed) {
          // Zoom in/out
          let zoom = canvas.getZoom();
          zoom = zoom * (1 + delta * 0.1) * 1; // Increase/decrease zoom by 10%
          zoom = Math.min(Math.max(zoom, 0.1), 20); // Limit zoom level
          canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, zoom);
        } else {
          if (isCmdPressed) {
            vpt[4] -= delta * 20;

            canvas.setViewportTransform(vpt);
          } else {
            vpt[5] -= delta * 20;
            canvas.setViewportTransform(vpt);
          }
        }
      };

      canvas.on("mouse:wheel", handleMouseWheel);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
        canvas.off("mouse:wheel", handleMouseWheel);
      };
    }
  }, [canvas]);

  return (
    <div className="p-4">
      <Flex justify="between">
        <Button onClick={chooseHandler}>
          <Text className="text-white">Select</Text>
        </Button>
        <Text className="font-semibold pt-10">{locationByID?.mapName}</Text>
        <Flex align="end" justify="end" gap="2" className=" pb-2">
          <button onClick={zoomIn} className="p-2 bg-white rounded-md shadow">
            <AiOutlineZoomIn className="text-titleFontColor" />
          </button>
          <button onClick={zoomOut} className="p-2 bg-white rounded-md shadow">
            <AiOutlineZoomOut className="text-titleFontColor" />
          </button>
          <button
            onClick={() => setTipShow(!tipShow)}
            className="p-2 bg-white rounded-md shadow"
          >
            <MdOutlineInfo className="text-titleFontColor" />
          </button>
        </Flex>
      </Flex>
      <div className="flex flex-col items-center justify-center overflow-hidden max-h-[600px]">
        <canvas id="canvas"></canvas>
      </div>
      {tipShow && (
        <Box className="fixed bottom-10 right-10 mt-4 ml-4 bg-white p-4 rounded-md shadow-lg z-50 max-w-[400px]">
          <Flex justify="between" align="center">
            <Flex direction="row" align="center" gap="2">
              <FaInfoCircle className="text-primary" />
              <span className="text-lg font-semibold">Tips</span>
            </Flex>
            <IoIosClose
              className="w-6 h-6 cursor-pointer"
              onClick={() => setTipShow(false)}
            />
          </Flex>
          <ul className="mt-2 text-sm text-gray-700">
            <li>
              <strong>Mouse Scroll:</strong> Up/Down Move
            </li>
            <li>
              <strong>Command (Alt) + Mouse Scroll:</strong>Left/Right Move
            </li>
            <li>
              <strong>Control + Mouse Scroll:</strong> Zoom In/Out
            </li>
          </ul>
        </Box>
      )}

      <Dialog.Root
        open={configureModalOpen}
        onOpenChange={setConfigureModalOpen}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-40" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <Flex>
              <Dialog.Title className="text-lg font-semibold">
                Configure Cleaning Settings
              </Dialog.Title>
            </Flex>

            <Grid gap="3" className="mt-4">
              <Text>
                Please configure the cleaning settings for your selected zones
                <span className="font-semibold pl-2">({selected?.title})</span>
              </Text>
              <Flex gap="3" align="center">
                <Text className="font-medium text-base text-titleFontColor w-[100px]">
                  Vacuum
                </Text>
                {vacuumItems.map((item, index) => (
                  <Flex
                    className={cn(
                      item.value == vacuum
                        ? "bg-primary text-white border-primary"
                        : "border-blue-1",
                      "border  w-[40px] h-[40px] rounded cursor-pointer"
                    )}
                    onClick={() => setVacuum(item.value)}
                    align="center"
                    justify="center"
                    key={index}
                  >
                    <Text className="font-medium text-base">{item.label}</Text>
                  </Flex>
                ))}
              </Flex>
              <Flex gap="3" align="center">
                <Text className="font-medium text-base text-titleFontColor w-[100px]">
                  Roller
                </Text>
                {rollerItems.map((item, index) => (
                  <Flex
                    className={cn(
                      item.value == roller
                        ? "bg-primary text-white border-primary"
                        : "border-blue-1",
                      "border  w-[40px] h-[40px] rounded cursor-pointer"
                    )}
                    onClick={() => setRoller(item.value)}
                    align="center"
                    justify="center"
                    key={index}
                  >
                    <Text className="font-medium text-base">{item.label}</Text>
                  </Flex>
                ))}
              </Flex>
              <Flex gap="3" align="center">
                <Text className="font-medium text-base text-titleFontColor w-[100px]">
                  Gutter
                </Text>
                {gutterItems.map((item, index) => (
                  <Flex
                    className={cn(
                      item.value == gutter
                        ? "bg-primary text-white border-primary"
                        : "border-blue-1",
                      "border  w-[40px] h-[40px] rounded cursor-pointer"
                    )}
                    onClick={() => setGutter(item.value)}
                    align="center"
                    justify="center"
                    key={index}
                  >
                    <Text className="font-medium text-base">{item.label}</Text>
                  </Flex>
                ))}
              </Flex>
              <Flex gap="3" align="center">
                <Text className="font-medium text-base text-titleFontColor w-[100px]">
                  Repeat
                </Text>
                {repeatItems.map((item, index) => (
                  <Flex
                    className={cn(
                      item.value == repeat
                        ? "bg-primary text-white border-primary"
                        : "border-blue-1",
                      "border  w-[40px] h-[40px] rounded cursor-pointer"
                    )}
                    onClick={() => setRepeat(item.value)}
                    align="center"
                    justify="center"
                    key={index}
                  >
                    <Text className="font-medium text-base">{item.label}</Text>
                  </Flex>
                ))}
              </Flex>
              <Flex gap="3" justify="end" className="pt-4">
                <SecondaryButton onClick={() => setConfigureModalOpen(false)}>
                  <Text>Cancel</Text>
                </SecondaryButton>
                <Button onClick={selectedToCleanHandler}>
                  <Text className="text-white">Apply</Text>
                </Button>
              </Flex>
            </Grid>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root open={chooseModalOpen} onOpenChange={setChooseModalOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-40" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <Flex justify="between">
              <Dialog.Title className="text-lg font-semibold">
                1 Zone Selected
              </Dialog.Title>

              <Dialog.Close>
                <IoIosClose className="w-6 h-6 cursor-pointer" />
              </Dialog.Close>
            </Flex>
            <Grid gap="3" className="mt-4">
              <Text>
                Zone
                <span className="font-semibold pl-2">({selected?.title})</span>
              </Text>

              <Flex gap="3" justify="end" className="pt-4">
                <SecondaryButton
                  onClick={() => {
                    setConfigureModalOpen(true);
                    setChooseModalOpen(false);
                  }}
                >
                  <Text>Zone to clean</Text>
                </SecondaryButton>
                {/* <Button onClick={selectedToBlockHandler}>
                  <Text className="text-white">Zone to Block</Text>
                </Button> */}
              </Flex>
            </Grid>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root open={unblockModalOpen} onOpenChange={setUnblockModalOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-40" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <Flex justify="between">
              <Dialog.Title className="text-lg font-semibold">
                Unblock This Zone?
              </Dialog.Title>
            </Flex>
            <Grid gap="3" className="mt-4">
              <Text>
                Are you sure you want to unblock
                <span className="font-semibold pl-2">
                  this zone ( {removeZone?.title})
                </span>
              </Text>

              <Flex gap="3" justify="end" className="pt-4">
                <SecondaryButton
                  onClick={() => {
                    setUnblockModalOpen(false);
                    setRemoveZone(null);
                  }}
                >
                  <Text>Cancel</Text>
                </SecondaryButton>
                <Button onClick={removeBlockHandler}>
                  <Text className="text-white">Unblock</Text>
                </Button>
              </Flex>
            </Grid>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={unselectModalOpen} onOpenChange={setUnselectModalOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-40" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <Flex justify="between">
              <Dialog.Title className="text-lg font-semibold">
                Unselect This Zone?
              </Dialog.Title>
            </Flex>
            <Grid gap="3" className="mt-4">
              <Text>
                Are you sure you want to unselect
                <span className="font-semibold pl-2">
                  this zone ( {unselectZone?.title})
                </span>
              </Text>

              <Flex gap="3" justify="end" className="pt-4">
                <SecondaryButton
                  onClick={() => {
                    setUnselectModalOpen(false);
                    setUnselectZone(null);
                  }}
                >
                  <Text>Cancel</Text>
                </SecondaryButton>
                <Button onClick={unSelectedToCleanHandler}>
                  <Text className="text-white">Remove</Text>
                </Button>
              </Flex>
            </Grid>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default ZoneViewPage;
