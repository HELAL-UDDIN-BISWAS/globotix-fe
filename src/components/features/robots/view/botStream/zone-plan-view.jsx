"use client";
import React, { useEffect, useState, useRef } from "react";
import { fabric } from "fabric";
import { useRouter } from "next/navigation";
import Button from "@/components/common/button";
import { Text } from "@/components/ui/typo";
import { Box, Flex, Grid } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/utils/cn";
import SecondaryButton from "@/components/button/SecondaryButton";
import toast from "react-hot-toast";
import useZonesByLocation from "@/hooks/useZonesByLocation";
import { resizedCanvasWidthHeight } from "@/utils/canva/resizedCanvasWidthHeight";
import { STORAGE_URL } from "@/lib/api";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { rosToGlobalPoints } from "@/utils/canva/manipulatePoint";
import { FaMousePointer, FaHandPaper } from "react-icons/fa";
import polygonCoordinates from "./data";
import styles from "./bot-zoneView.module.css";
const ZonePlanViewPage = ({
  defaultRobot,
  pathData,
  selectedZoneToClean,
  setSelectedZoneToClean,
  selectedZoneToBlock,
  setSelectedZoneToBlock,
  removeZone,
  setRemoveZone,
  unselectZone,
  setUnselectZone,
  editEnable,
  canvas,
  setCanvas,
  setLocationById,
  setChangeTime,
  changeTime,
  planDetail,
  currentStep,
  locationById,
  setCurrentStep,
  setIsPlaying,
}) => {
  const router = useRouter();

  const [dragEnable, setDragEnable] = useState(true); // State for enabling/disabling dragging
  const canvasReference = useRef(null);
  const canvasWidth = 800;
  const canvasHeight = 600;
  const [mapLocationId, setMapLocationId] = useState(null);
  const { locationZones, locationByID, getLocationByID, getZoneByLocation } =
    useZonesByLocation();
  // console.log("changeTime ...", changeTime);
  const clearCanvas = () => {
    var canvasDisplay = document.getElementById("canvas");
    if (canvasDisplay && !!changeTime) {
      var context = canvasDisplay.getContext("2d");
      if (context && !!canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        setChangeTime(false);
      } else {
        console.error("Failed to get canvas context.");
      }
    } else {
      console.error("Canvas element not found.");
    }
  };
  useEffect(() => {
    if (!!defaultRobot?.locations) {
      getLocationByID(mapLocationId);
      getZoneByLocation(mapLocationId);
    }
  }, [mapLocationId]);

  useEffect(() => {
    // console.log("defaultRobot locationById...", defaultRobot);
    !!defaultRobot?.locations &&
      setMapLocationId(+defaultRobot?.locations[0]?.id);
  }, [locationById, defaultRobot]);

  useEffect(() => {
    // Check if the map_name in pathData matches the current map
    if (!!pathData && !!canvas) {
      const mapName = pathData[currentStep]?.map_name;
      // console.log("map is checking...", mapName);
      const getLocationByMapNameFromData = defaultRobot?.locations?.filter(
        (eachLocation) => eachLocation.name == mapName
      )[0];
      if (!!mapName && mapName !== locationByID?.mapName) {
        // getLocationById(mapName); // Fetch new map based on the map_name
        console.log(
          "map is changed...from ",
          locationByID?.mapName,
          " to ",
          mapName
        );
        setIsPlaying(false);
        setCurrentStep(0);
        setMapLocationId(+getLocationByMapNameFromData?.id);
      }
    }
  }, [pathData, canvas, currentStep]);
  useEffect(() => {
    if (!!locationByID && currentStep === 0) {
      clearCanvas();

      setLocationById(locationByID);
      let { updatedCanvasWidth, updatedCanvasHeight } =
        resizedCanvasWidthHeight(
          locationByID?.map.width,
          locationByID?.map.height,
          canvasWidth,
          canvasHeight,
          window.innerWidth * 0.97
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
      console.log("locationID...", locationByID);
      if (!!locationByID?.map.url) {
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
  }, [locationByID, canvasWidth, canvasHeight, changeTime]);

  useEffect(() => {
    if (!!canvas) {
      // canvas != null && canvas.clear();
      renderPolygons();
      canvas.off("mouse:wheel");
    }
  }, [canvas, locationZones]);
  // Assuming reScaleHZPoints is your array of points
  // URL of the custom icon

  const renderPolygons = () => {
    if (locationZones && !!locationByID?.map && !!locationByID.mapMetaData) {
      locationZones.forEach((zone) => {
        const reScaleHZPoints = rosToGlobalPoints(
          zone.points,
          locationByID?.map,
          canvas,
          "other",
          locationByID.mapMetaData
        );

        const existedClean = selectedZoneToClean?.find(
          (item) => item.zone.id == zone.id
        );
        const existedBlock = selectedZoneToBlock?.find(
          (item) => item.zone.id == zone.id
        );
        const poly = new fabric.Polygon(reScaleHZPoints, {
          fill: existedClean
            ? existedClean.color
            : existedBlock
            ? "#D9D9D9"
            : "#D9D9D933",
          stroke: existedClean
            ? existedClean.color
            : existedBlock
            ? "#D9D9D9"
            : "#D9D9D9",
          strokeWidth: 3,
          scaleX: 1,
          scaleY: 1,
          objectCaching: false,
          transparentCorners: false,
          cornerColor: "#BFA01D",
          title: zone.title,
          id: zone.id,
          color: "white",
          lockRotation: true,
          selectable: false,
          lockSkewingX: true,
          lockSkewingY: true,
          lockScalingFlip: true,
          lockMovementX: true,
          lockScalingFlip: true,
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
        });

        if (canvas) {
          canvas.add(poly);
        }
        addTitleToPolygon(poly, zone.title);
      });
    }
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

  // Zoom functions
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
      let isDragging = false;
      let lastPosX = 0;
      let lastPosY = 0;

      canvas.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      canvas.on("mouse:down", function (opt) {
        if (dragEnable && (opt.e.button === 0 || opt.e.button === 1)) {
          // Check if left or middle button is pressed
          isDragging = true;
          lastPosX = opt.e.clientX;
          lastPosY = opt.e.clientY;
        }
      });

      canvas.on("mouse:move", function (opt) {
        if (isDragging) {
          let e = opt.e;
          let vpt = canvas.viewportTransform.slice(0); // Clone the array to avoid mutating state directly
          vpt[4] += e.clientX - lastPosX;
          vpt[5] += e.clientY - lastPosY;
          canvas.setViewportTransform(vpt);
          lastPosX = e.clientX;
          lastPosY = e.clientY;
        }
      });

      canvas.on("mouse:up", function () {
        isDragging = false;
      });

      // Prevent default action for context menu (right-click)
      canvas.on("mouse:up", function (opt) {
        if (opt.e.button === 2) {
          opt.e.preventDefault();
        }
      });
    }
  }, [canvas, dragEnable]);

  return (
    <>
      <div className="p-2 ">
        <Flex justify="between">
          <div></div>
          <Text className="flex font-semibold pt-1 justify-center items-center ">
            {!mapLocationId && "Location is not assigned!!!"}{" "}
            {locationByID?.mapName}
          </Text>
          <Flex direction="row" align="end" justify="flex-end">
            <button onClick={zoomIn} className="p-2 bg-white rounded-md shadow">
              <AiOutlineZoomIn className="text-titleFontColor" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 bg-white rounded-md shadow"
            >
              <AiOutlineZoomOut className="text-titleFontColor" />
            </button>
            {/* <button
              className="p-2 bg-white rounded-md shadow"
              onClick={() => setDragEnable(!dragEnable)}
            >
              {dragEnable ? (
                <FaMousePointer className="text-titleFontColor" />
              ) : (
                <FaHandPaper className="text-titleFontColor" />
              )}
            </button> */}
          </Flex>
        </Flex>

        <div className="flex flex-col items-center justify-center overflow-hidden max-h-[400px] min-h-[400px]">
          <canvas ref={canvasReference} id="canvas"></canvas>
          {/* <div class={styles.robot} id="robot"></div> */}
        </div>
      </div>
    </>
  );
};

export default ZonePlanViewPage;
