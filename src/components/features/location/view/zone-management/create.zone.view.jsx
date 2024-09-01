"use client";
import Page from "@/components/layout/page";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaInfoCircle } from "react-icons/fa";
import { fabric } from "fabric";
import { useEffect, useState } from "react";
import { Box, Flex } from "@radix-ui/themes";
import { resizedCanvasWidthHeight } from "@/utils/canva/resizedCanvasWidthHeight";
import { STORAGE_URL } from "@/lib/api";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import Button from "@/components/common/button";
import { Text } from "@/components/ui/typo";
import {
  globalToRosPoints,
  rosToGlobalPoints,
} from "@/utils/canva/manipulatePoint";
import { IoIosClose } from "react-icons/io";
import { MdOutlineInfo } from "react-icons/md";

const CreateZoneView = ({
  selectedLocation,
  setLocationZones,
  locationZones,
  setIsZoneManagement,
  setCreateZoneOpen,
}) => {
  const router = useRouter();
  const [canvas, setCanvas] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [title, setTitle] = useState(
    `cleaning_zone_${locationZones.length + 1}`
  );
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [tipShow, setTipShow] = useState(false);
  const canvasWidth = 600;
  const canvasHeight = 600;

  useEffect(() => {
    if (selectedLocation) {
      let { updatedCanvasWidth, updatedCanvasHeight } =
        resizedCanvasWidthHeight(
          selectedLocation?.map.width,
          selectedLocation?.map.height,
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
        c.dispose();
        setCanvas(null);
      };
    }
  }, [selectedLocation, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (canvas) {
      renderPolygons();
    }
  }, [canvas, locationZones]);

  useEffect(() => {
    if (canvas) {
      if (!polygon) {
        const poly = new fabric.Polygon(polygonPoints, {
          fill: "#D9D9D933",
          stroke: "#D9D9D9",
          strokeWidth: 1,
          scaleX: 1,
          scaleY: 1,
          objectCaching: false,
          transparentCorners: false,
          cornerColor: "#BFA01D",
          color: "white",
          lockRotation: true,
          selectable: true,
        });

        canvas.add(poly);
        setPolygon(poly);
        setupPolygonEditing(poly);
        poly.toggleEditMode();
      } else {
        polygon.set({ points: polygonPoints });
        canvas.renderAll();
      }

      const handleMouseDown = (opt) => {
        const pointer = canvas.getPointer(opt.e);
        const updatedPoints = [...polygonPoints, pointer];
        setPolygonPoints(updatedPoints);
        canvas.getObjects()[locationZones.length + 1].toggleEditMode();
        canvas.getObjects()[locationZones.length + 1].toggleEditMode();
      };

      canvas.on("mouse:dblclick", handleMouseDown);

      return () => {
        canvas.off("mouse:dblclick", handleMouseDown);
      };
    }
  }, [canvas, polygonPoints, polygon, isEditing]);

  const renderPolygons = () => {
    if (locationZones) {
      locationZones.forEach((zone) => {
        if (zone.points.length > 0) {
          const reScaleHZPoints = rosToGlobalPoints(
            zone.points,
            selectedLocation?.map,
            canvas,
            "other",
            selectedLocation.mapMetaData
          );

          const poly = new fabric.Polygon(reScaleHZPoints, {
            fill: "#FAC898",
            stroke: "#FAC898",
            strokeWidth: 1,
            scaleX: 1,
            scaleY: 1,
            objectCaching: false,
            transparentCorners: false,
            title: zone.title,
            id: zone.id,
            color: "white",
            lockRotation: true,
            selectable: false,
          });

          if (canvas) {
            canvas.add(poly);
            setupPolygonEditing(poly);
          }
          addTitleToPolygon(poly, zone.title);
        }
      });
    }
  };

  function setupPolygonEditing(polygon) {
    function toggleEditMode() {
      canvas.setActiveObject(polygon);
      polygon.edit = true;

      const lastControl = polygon.points.length - 1;
      polygon.cornerStyle = "circle";
      polygon.cornerColor = "rgba(0,0,255,0.5)";
      polygon.controls = polygon.points.reduce(function (acc, point, index) {
        acc["p" + index] = new fabric.Control({
          positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler
          ),
          actionName: "modifyPolygon",
          pointIndex: index,
        });
        return acc;
      }, {});

      polygon.hasBorders = true;
      canvas.requestRenderAll();
    }

    polygon.toggleEditMode = toggleEditMode;
  }

  function polygonPositionHandler(dim, finalMatrix, fabricObject) {
    const x =
        fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
      y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
    return fabric.util.transformPoint(
      { x: x, y: y },
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix()
      )
    );
  }

  function anchorWrapper(anchorIndex, fn) {
    return function (eventData, transform, x, y) {
      const fabricObject = transform.target,
        absolutePoint = fabric.util.transformPoint(
          {
            x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
          },
          fabricObject.calcTransformMatrix()
        ),
        actionPerformed = fn(eventData, transform, x, y),
        newDim = fabricObject._setPositionDimensions({}),
        polygonBaseSize = getObjectSizeWithStroke(fabricObject),
        newX =
          (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
          polygonBaseSize.x,
        newY =
          (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
          polygonBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  }

  function getObjectSizeWithStroke(object) {
    const stroke = new fabric.Point(
      object.strokeUniform ? 1 / object.scaleX : 1,
      object.strokeUniform ? 1 / object.scaleY : 1
    ).multiply(object.strokeWidth);
    return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
  }

  function actionHandler(eventData, transform, x, y) {
    const polygon = transform.target,
      currentControl = polygon.controls[polygon.__corner],
      mouseLocalPosition = polygon.toLocalPoint(
        new fabric.Point(x, y),
        "center",
        "center"
      ),
      polygonBaseSize = getObjectSizeWithStroke(polygon),
      size = polygon._getTransformedDimensions(0 + 1, 0 + 1),
      finalPointPosition = {
        x:
          (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
          polygon.pathOffset.x,
        y:
          (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
          polygon.pathOffset.y,
      };
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    return true;
  }

  function addTitleToPolygon(polygon, title) {
    const text = new fabric.Text(title, {
      left: polygon.left + (polygon.width * polygon.scaleX) / 2,
      top: polygon.top + (polygon.height * polygon.scaleY) / 2,
      fontSize: 8,
      originX: "center",
      originY: "center",
      fill: "black",
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      selectable: false, // Make text unselectable
      evented: false,
    });
    text.relatedObject = polygon;
    if (canvas) {
      canvas.add(text);
      canvas.bringToFront(text);
    }
    return text;
  }

  const zoomIn = () => {
    if (canvas) {
      let zoom = canvas.getZoom();
      zoom = zoom * 1.1; // Increase zoom level by 10%
      canvas.zoomToPoint(
        { x: canvas.getWidth() / 2, y: canvas.getHeight() / 2 },
        zoom
      );
      canvas.requestRenderAll();
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
      canvas.requestRenderAll();
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
          zoom = zoom * (1 + delta * 0.1) * 1;
          zoom = Math.min(Math.max(zoom, 0.1), 5);
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

  useEffect(() => {
    canvas && canvas.getObjects()[locationZones.length].toggleEditMode();
  }, [polygonPoints]);

  const saveHandler = () => {
    const reScaleHZPoints = globalToRosPoints(
      polygonPoints,
      selectedLocation?.map,
      canvas,
      "other",
      selectedLocation.mapMetaData
    );
    const newZoneData = {
      id: "",
      title: title,
      points: reScaleHZPoints,
      type: "cleaning",
      order: locationZones.length + 1,
    };
    setLocationZones([...locationZones, newZoneData]);
    setCreateZoneOpen(false);
  };

  return (
    <Box className="overflow-hidden">
      <Page
        title={
          <div className="flex items-center gap-4">
            <FaChevronLeft
              color="text-primary"
              className="cursor-pointer"
              onClick={() => setCreateZoneOpen(false)}
            />
            <span className="text-titleFontColor w-full text-lg font-semibold">
              Create Zone
            </span>
          </div>
        }
      >
        <div>
          <Flex direction="column" justify="center" align="center">
            <Box className="w-[90%] pb-2">
              <Flex justify="end">
                <Flex align="end" justify="end" gap="1">
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
                  <button
                    onClick={() => setTipShow(!tipShow)}
                    className="p-2 bg-white rounded-md shadow"
                  >
                    <MdOutlineInfo className="text-titleFontColor" />
                  </button>
                </Flex>
              </Flex>
            </Box>
            <Box className="bg-gray/20 max-w-[90%]">
              <div className="flex flex-col items-center justify-center max-w-[80%]">
                <canvas id="canvas"></canvas>
              </div>
            </Box>

            <Flex
              direction="column"
              align="start"
              justify="start"
              className="w-full px-4 pt-4"
            >
              <input
                autoComplete={false}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`
              bg-white ml-4
            relative z-10 w-[400px] text-sm text-black-1 border-2 border-white-1 rounded-[10px] h-[45px] py-[12px] px-[15px] focus:outline-none`}
                placeholder={"Enter Zone Name"}
              />
              <div className="ml-4 mt-2">
                <Button
                  onClick={saveHandler}
                  disabled={polygonPoints.length == 0 || !title}
                >
                  <Text className="text-white">Save</Text>
                </Button>
              </div>
            </Flex>
          </Flex>
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
              <li>
                <strong>Double-Click:</strong> Create point for new zone
              </li>
            </ul>
          </Box>
        )}
      </Page>
    </Box>
  );
};

export default CreateZoneView;
