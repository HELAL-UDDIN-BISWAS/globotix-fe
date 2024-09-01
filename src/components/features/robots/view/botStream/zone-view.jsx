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
const ZoneViewBotPage = ({
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
}) => {
  const router = useRouter();

  const [dragEnable, setDragEnable] = useState(true); // State for enabling/disabling dragging
  const canvasReference = useRef(null);
  const canvasWidth = 800;
  const canvasHeight = 600;

  const { locationZones, locationByID, getLocationByID } = useZonesByLocation();
  // console.log("changeTime ...", changeTime);
  const clearCanvas = () => {
    var canvas = document.getElementById("canvas");
    if (canvas && !!changeTime) {
      var context = canvas.getContext("2d");
      if (context) {
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
    getLocationByID(planDetail.location?.id);
  }, [planDetail]);
  useEffect(() => {
    if (locationByID) {
      clearCanvas();
      setLocationById(locationByID);
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
  // const arrowUrl = "/upload/images/Polygon1.png";
  const arrowUrl = "/upload/images/robot.png";

  // Function to add icon at a specific point
  // Function to add and rotate the arrow icon at a specific point
  const addArrowAtPoint = (startPoint, endPoint) => {
    // Calculate the angle in radians
    const angleRadians = Math.atan2(
      endPoint.y - startPoint.y,
      endPoint.x - startPoint.x
    );
    // Convert to degrees
    const angleDegrees = angleRadians * (90 / Math.PI);

    fabric.Image.fromURL(arrowUrl, function (img) {
      img.set({
        // left: (startPoint.x + endPoint.x) / 2, // Center the arrow between the two points
        // top: (startPoint.y + endPoint.y) / 2,
        left: endPoint.x, // Center the arrow between the two points
        top: endPoint.y,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
        angle: angleDegrees, // Rotate the image to align with the line
        scaleX: 0.0225, // Scale down the arrow size
        scaleY: 0.0225, // Scale down the arrow size
      });
      if (canvas) {
        canvas.add(img);
      }
    });
  };
  const renderPolygons = () => {
    if (locationZones) {
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
          selectable: existedBlock ? false : true,
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
      // Create a polyline using the reScaleHZPoints array
      // const reScaleHZLinePoints = rosToGlobalPoints(
      //   polygonCoordinates,
      //   locationByID?.map,
      //   canvas,
      //   "other",
      //   locationByID.mapMetaData
      // );
      // console.log("polygonCoordinates...", polygonCoordinates);
      // console.log("getPointsForRoute...", reScaleHZLinePoints);
      // // Convert points array to path data string
      // // Assuming reScaleHZPoints is your array of points

      // // Loop through the points array and draw lines between consecutive points
      // for (let i = 0; i < reScaleHZLinePoints.length - 1; i++) {
      //   const startPoint = reScaleHZLinePoints[i];
      //   const endPoint = reScaleHZLinePoints[i + 1];
      //   console.log("startPoint", startPoint);
      //   console.log("endPoint", endPoint);
      //   // Create a line object for each pair of consecutive points
      //   const line = new fabric.Line(
      //     [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
      //     {
      //       stroke: "#D95723", // Color of the line
      //       strokeWidth: 0.3, // Width of the line
      //       selectable: false, // Set to true if you want the line to be selectable
      //       evented: false, // Set to true if you want the line to respond to events
      //       lockMovementX: true, // Lock horizontal movement
      //       lockMovementY: true, // Lock vertical movement
      //       lockScalingX: true, // Lock horizontal scaling
      //       lockScalingY: true, // Lock vertical scaling
      //       lockRotation: true, // Lock rotation
      //       hasControls: false, // Hide control handles
      //       hasBorders: false, // Hide borders around the line
      //     }
      //   );

      //   if (canvas) {
      //     canvas.add(line);
      //     // Add icon at start and end points of each line segment
      //     //
      //     console.log("endPoint...", endPoint);
      //     console.log(
      //       "reScaleHZLinePoints.length...",
      //       reScaleHZLinePoints.length
      //     );
      //     if (
      //       endPoint.x ==
      //         reScaleHZLinePoints[reScaleHZLinePoints.length - 1].x &&
      //       endPoint.y == reScaleHZLinePoints[reScaleHZLinePoints.length - 1].y
      //     ) {
      //       // Add and rotate arrow at the midpoint of each line segment
      //       addArrowAtPoint(startPoint, endPoint);
      //     }
      //   }
      // }
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
          <Text className="flex font-semibold pt-1 justify-center items-center">
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

export default ZoneViewBotPage;
