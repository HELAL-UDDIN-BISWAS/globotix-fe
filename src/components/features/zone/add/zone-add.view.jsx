"use client";
import Page from "@/components/layout/page";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import { fabric } from "fabric";
import { useEffect, useState } from "react";
import Button from "@/components/common/button";
import { Text } from "@/components/ui/typo";
import { Box, Flex } from "@radix-ui/themes";
import { useMutation } from "@apollo/client";
import { CREATE_ZONE, UPDATE_ZONE } from "@/graphql/mutation/zone";
import apolloClient from "@/lib/apolloClient";
import toast from "react-hot-toast";
import { resizedCanvasWidthHeight } from "@/utils/canva/resizedCanvasWidthHeight";
import { STORAGE_URL } from "@/lib/api";
import { rosToGlobalPoints } from "@/utils/canva/manipulatePoint";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import SecondaryButton from "@/components/button/SecondaryButton";

const ZoneAddView = ({
  selectedLocation,
  setSelectedLocation,
  setIsZoneManagement,
}) => {
  const router = useRouter();

  const locationZones = selectedLocation.zone;

  const [canvas, setCanvas] = useState(null);
  const [polygonTitle, setPolygonTitle] = useState("");
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  const [result, setResult] = useState("");
  const [dragEnable, setDragEnable] = useState(true);
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
      };
    }
  }, [selectedLocation, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (canvas) {
      canvas.clear();
      renderPolygons();
      canvas.off("mouse:wheel");
    }
  }, [canvas, locationZones]);

  const renderPolygons = () => {
    if (locationZones) {
      locationZones.forEach((zone) => {
        console.log("zone.points", zone.points);
        if (zone.points.length > 0) {
          const reScaleHZPoints = rosToGlobalPoints(
            zone.points,
            selectedLocation?.map,
            canvas,
            "other",
            selectedLocation.mapMetaData
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
          });

          if (canvas) {
            canvas.add(poly);
          }
          addTitleToPolygon(poly, zone.title);
        }
      });
    }
  };

  // function createPolygon() {
  //   const initialPoints = Array.from({ length: pointNumber }, (_, i) => {
  //     const angle = (i * 2 * Math.PI) / pointNumber;
  //     return { x: Math.cos(angle) * 50, y: Math.sin(angle) * 50 };
  //   });

  //   const title =
  //     polygonTitle.trim() !== "" ? polygonTitle : `Zone ${zoneCount}`;

  //   const poly = new fabric.Polygon(initialPoints, {
  //     left: 200,
  //     top: 300,
  //     fill: "#D9D9D933",
  //     stroke: "#D9D9D9",
  //     strokeWidth: 1,
  //     scaleX: 2,
  //     scaleY: 2,
  //     objectCaching: false,
  //     transparentCorners: false,
  //     cornerColor: "blue",
  //     cornerSize: 10,
  //     title: title,
  //     color: "white",
  //     lockRotation: true,
  //   });

  //   if (canvas) {
  //     canvas.viewportTransform = [0.7, 0, 0, 0.7, -50, 50];
  //     canvas.add(poly);
  //   }

  //   const text = addTitleToPolygon(poly, title);

  //   setupPolygonEditing(poly, text);

  //   setZoneCount(zoneCount + 1);
  //   setPolygonTitle("");
  //   setPointNumber(5);
  //   closeModal();
  // }

  function setupPolygonEditing(polygon, text) {
    polygon.edit = false;

    function toggleEditMode() {
      if (canvas) {
        canvas.setActiveObject(polygon);
        polygon.edit = !polygon.edit;
        if (polygon.edit) {
          const lastControl = polygon.points.length - 1;
          polygon.cornerStyle = "circle";
          polygon.cornerColor = "rgba(0,0,255,0.5)";
          polygon.controls = polygon.points.reduce(function (
            acc,
            point,
            index
          ) {
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
        } else {
          polygon.cornerColor = "blue";
          polygon.cornerStyle = "rect";
          polygon.controls = fabric.Object.prototype.controls;
        }
        polygon.hasBorders = !polygon.edit;
        canvas.requestRenderAll();
      }
    }

    polygon.toggleEditMode = toggleEditMode;

    polygon.on("modified", () => updateTextPosition(polygon, text));
    polygon.on("moving", () => updateTextPosition(polygon, text));
  }

  function polygonPositionHandler(dim, finalMatrix, fabricObject) {
    var x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
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
      var fabricObject = transform.target,
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
    var stroke = new fabric.Point(
      object.strokeUniform ? 1 / object.scaleX : 1,
      object.strokeUniform ? 1 / object.scaleY : 1
    ).multiply(object.strokeWidth);
    return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
  }

  function actionHandler(eventData, transform, x, y) {
    var polygon = transform.target,
      currentControl = polygon.controls[polygon.__corner],
      mouseLocalPosition = polygon.toLocalPoint(
        new fabric.Point(x, y),
        "center",
        "center"
      ),
      polygonBaseSize = getObjectSizeWithStroke(polygon),
      size = polygon._getTransformedDimensions(0, 0),
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
      fontSize: 10,
      originX: "center",
      originY: "center",
      fill: "black",
      selectable: false,
    });
    text.relatedObject = polygon;
    if (canvas) {
      canvas.add(text);
      canvas.bringToFront(text);
    }
    return text;
  }

  function updateTextPosition(polygon, text) {
    text.set({
      left: polygon.left + (polygon.width * polygon.scaleX) / 2,
      top: polygon.top + (polygon.height * polygon.scaleY) / 2,
    });
    text.setCoords();
    canvas.requestRenderAll();
  }

  function deleteSelectedObject() {
    if (canvas) {
      const selectedObject = canvas.getActiveObject();
      if (selectedObject) {
        canvas.forEachObject(function (obj) {
          if (obj.type === "text" && obj.relatedObject === selectedObject) {
            canvas.remove(obj);
          }
        });

        canvas.remove(selectedObject);
        canvas.requestRenderAll();
      }
    }
  }

  const [createZoneAction] = useMutation(CREATE_ZONE, {
    client: apolloClient,
    onCompleted: () => {
      toast.success("zone create completed");
      router.push("/location");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [updateZoneAction] = useMutation(UPDATE_ZONE, {
    client: apolloClient,
    onCompleted: () => {
      // toast.success("zone update completed");
      // router.push("/location");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  async function viewAllZones() {
    if (canvas) {
      const allPolygons = [];
      canvas.forEachObject(async function (obj) {
        if (obj.type === "polygon") {
          const polygonDetails = {
            title: obj.title,
            location: parseInt(location?.id),
          };
          allPolygons.push(polygonDetails);
          await updateZoneAction({
            variables: {
              id: obj.id,
              data: polygonDetails,
            },
          });
        }
        router.push("/location");
      });
      setResult(allPolygons);
      setZones(allPolygons);
      return allPolygons;
    }
  }

  function openEditModal() {
    if (canvas) {
      const selectedPolygon = canvas.getActiveObject();
      if (selectedPolygon && selectedPolygon.type === "polygon") {
        setSelectedPolygon(selectedPolygon);
        setPolygonTitle(selectedPolygon.title);
        setEditModalIsOpen(true);
      }
    }
  }

  function closeEditModal() {
    setEditModalIsOpen(false);
  }

  function handleEditPolygon() {
    if (selectedPolygon) {
      selectedPolygon.set({
        title: polygonTitle,
      });

      const text = findTitleText(selectedPolygon);
      if (text) {
        text.set({
          text: polygonTitle,
        });
      }

      setSelectedPolygon(null);
      closeEditModal();
      canvas.requestRenderAll();
    }
  }

  function findTitleText(polygon) {
    let foundText = null;
    canvas.forEachObject(function (obj) {
      if (obj.type === "text" && obj.relatedObject === polygon) {
        foundText = obj;
      }
    });
    return foundText;
  }
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
      let isCtrlPressed = false;
      const handleKeyDown = (event) => {
        if (event.key === "Control") {
          isCtrlPressed = true;
        }
      };

      const handleKeyUp = (event) => {
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
          vpt[4] -= delta * 20;
        } else {
          vpt[5] -= delta * 20;
        }
        canvas.setViewportTransform(vpt); // Update the canvas viewport transform
      };

      canvas.on("mouse:wheel", handleMouseWheel);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
        canvas.off("mouse:wheel", handleMouseWheel);
      };
    }
  }, [canvas, dragEnable]);

  return (
    <Box className="overflow-hidden">
      <Page
        title={
          <div className="flex items-center gap-4">
            <FaChevronLeft
              color="text-primary"
              className="cursor-pointer"
              onClick={() => setIsZoneManagement(false)}
            />
            <span className="text-titleFontColor w-full text-lg font-semibold">
              New Zone
            </span>
          </div>
        }
      >
        <Box className="pl-6 pt-6">
          <Button onClick={viewAllZones}>
            <Text className="text-white">Save Changes</Text>
          </Button>
        </Box>

        <Flex direction="column" justify="center" align="center">
          <Box className="w-[90%]">
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
          </Box>
          <Box className="bg-gray/20 max-w-[90%]">
            <div className="flex flex-col items-center justify-center max-w-[80%]">
              <canvas id="canvas"></canvas>
            </div>
          </Box>
        </Flex>

        <Flex className="px-[5%] pt-4" justify="between">
          <Button>
            <Text className="text-white">New Zone</Text>
          </Button>
          <SecondaryButton onClick={openEditModal}>
            <Text>Edit Zone</Text>
          </SecondaryButton>
        </Flex>
      </Page>
    </Box>
  );
};
export default ZoneAddView;
