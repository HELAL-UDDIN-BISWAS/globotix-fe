"use client";
import SecondaryButton from "@/components/button/SecondaryButton";
import Button from "@/components/common/button";
import { resizedCanvasWidthHeight } from "@/utils/canva/resizedCanvasWidthHeight";
import { Dialog, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";

export const NewZoneModal = ({
  open,
  onClose,
  handleAddPolygon,
  selectedLocation,
}) => {
  const [title, setTitle] = useState("");

  function handlePolygonTitleChange(event) {
    setTitle(event.target.value);
  }

  const [canvas, setCanvas] = useState(null);
  const canvasWidth = 800;
  const canvasHeight = 600;

  useEffect(() => {
    if (selectedLocation) {
      const { updatedCanvasWidth, updatedCanvasHeight } =
        resizedCanvasWidthHeight(
          selectedLocation?.map?.width,
          selectedLocation?.map?.height,
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

      if (selectedLocation?.map.url) {
        fabric.Image.fromURL(STORAGE_URL + selectedLocation?.map.url, (img) => {
          c?.setBackgroundImage(img, c.renderAll.bind(c), {
            scaleX: updatedCanvasWidth / selectedLocation?.map.width,
            scaleY: updatedCanvasHeight / selectedLocation?.map.height,
          });
        });
      }

      setCanvas(c);

      return () => {
        c?.dispose();
        setCanvas(null);
      };
    }
  }, [selectedLocation, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (canvas) {
      renderPolygons();
      canvas.off("mouse:wheel");
    }
  }, [canvas]);

  const renderPolygons = () => {
    // Your polygon rendering logic here
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
      selectable: false,
      evented: false,
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
      const handleMouseWheel = (opt) => {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      };

      const handleMouseDown = (opt) => {
        if (opt.e.button === 1 || opt.e.button === 0) {
          isDragging = true;
          lastPosX = opt.e.clientX;
          lastPosY = opt.e.clientY;
        }
      };

      const handleMouseMove = (opt) => {
        if (isDragging) {
          let e = opt.e;
          let vpt = canvas.viewportTransform;
          vpt[4] += e.clientX - lastPosX;
          vpt[5] += e.clientY - lastPosY;
          canvas.requestRenderAll();
          lastPosX = e.clientX;
          lastPosY = e.clientY;
        }
      };

      const handleMouseUp = (opt) => {
        isDragging = false;
        if (opt.e.button === 2) {
          opt.e.preventDefault();
        }
      };

      canvas.on("mouse:wheel", handleMouseWheel);
      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:move", handleMouseMove);
      canvas.on("mouse:up", handleMouseUp);

      return () => {
        canvas.off("mouse:wheel", handleMouseWheel);
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMove);
        canvas.off("mouse:up", handleMouseUp);
      };
    }
  }, [canvas]);

  return (
    <>
      {open && (
        <div
          onClick={() => onClose(false)}
          className="bg-black/75 fixed w-full h-screen top-0 left-0 z-[997] opacity-40 transition-all"
        ></div>
      )}
      <div
        className={`transition-all duration-500 fixed z-[999] ${
          open ? "bottom-1/2 translate-y-1/2" : "-bottom-[1000px]"
        } left-1/2 -translate-x-1/2 px-[30px] rounded-[20px] min-w-[500px] w-[90%] h-[90%] bg-white text-black-1 overflow-auto`}
      >
        <div className="overflow-visible">
          <div className="p-4">
            <Flex direction="column" align="end" justify="end" gap="2">
              <button
                onClick={zoomIn}
                className="p-2 bg-white rounded-md shadow"
              >
                <AiOutlineZoomIn className="text-titleFontColor" />
              </button>
              <button
                onClick={zoomOut}
                className="p-2 bg-white rounded-md shadow"
              >
                <AiOutlineZoomOut className="text-titleFontColor" />
              </button>
            </Flex>
            <div className="flex flex-col items-center justify-center max-h-[500px]">
              <canvas id="canvas"></canvas>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
