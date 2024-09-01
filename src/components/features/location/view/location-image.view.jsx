"use client";
import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { STORAGE_URL } from "@/lib/api";
import { rosToGlobalPoints } from "@/utils/canva/manipulatePoint";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { Box, Flex } from "@radix-ui/themes";
import { resizedCanvasWidthHeight } from "@/utils/canva/resizedCanvasWidthHeight";
import { IoIosClose } from "react-icons/io";
import { MdOutlineInfo } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";

const LocationImageView = ({ zone, location }) => {
  const [canvas, setCanvas] = useState(null);
  const [tipShow, setTipShow] = useState(false);
  const canvasWidth = 800;
  const canvasHeight = 600;

  useEffect(() => {
    if (location) {
      let { updatedCanvasWidth, updatedCanvasHeight } =
        resizedCanvasWidthHeight(
          location?.map.width,
          location?.map.height,
          canvasWidth,
          canvasHeight,
          window.innerWidth
        );

      const c = new fabric.Canvas("canvas", {
        height: updatedCanvasHeight,
        width: updatedCanvasWidth,
        backgroundColor: "grey",
        centeredScaling: false,
        rotationCursor: false,
        selection: false,
        selectionColor: "#5842C333",
        selectionBorderColor: "#5842C3",
        cornerColor: "#BFA01D",
        uniformScaling: false,
      });

      if (location?.map.url) {
        fabric.Image.fromURL(STORAGE_URL + location?.map.url, (img) => {
          c?.setBackgroundImage(img, c.renderAll.bind(c), {
            scaleX: updatedCanvasWidth / location?.map.width,
            scaleY: updatedCanvasHeight / location?.map.height,
          });
        });
      }
      setCanvas(c);
      return () => {
        c.dispose();
        setCanvas(null);
      };
    }
  }, [location, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (canvas) {
      canvas.getObjects().forEach((obj) => {
        canvas.remove(obj);
      });
      renderPolygons();
      canvas.off("mouse:wheel");
    }
  }, [canvas, zone]);

  const renderPolygons = () => {
    if (zone) {
      zone.forEach((zone) => {
        const reScaleHZPoints = rosToGlobalPoints(
          zone.points,
          location?.map,
          canvas,
          "other",
          location.mapMetaData
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

        if (isCmdPressed) {
          // Zoom in/out
          let zoom = canvas.getZoom();
          zoom = zoom * (1 + delta * 0.1) * 1; // Increase/decrease zoom by 10%
          zoom = Math.min(Math.max(zoom, 0.1), 20); // Limit zoom level
          canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, zoom);
        } else {
          if (isCtrlPressed) {
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
      <Flex align="end" justify="end" gap="2" className=" pb-2">
        <button onClick={zoomIn} className="p-2 bg-white rounded-md shadow">
          <AiOutlineZoomIn className="text-titleFontColor" />
        </button>
        <button onClick={zoomOut} className="p-2 bg-white rounded-md shadow">
          <AiOutlineZoomOut className="text-titleFontColor" />
        </button>
        {/* <button
          onClick={() => setTipShow(!tipShow)}
          className="p-2 bg-white rounded-md shadow"
        >
          <MdOutlineInfo className="text-titleFontColor" />
        </button> */}
      </Flex>
      <div className="flex flex-col items-center justify-center max-h-[500px]">
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
    </div>
  );
};

export default LocationImageView;
