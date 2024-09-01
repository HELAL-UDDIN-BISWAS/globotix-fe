"use client";
import Page from "@/components/layout/page";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaInfoCircle } from "react-icons/fa";
import { fabric } from "fabric";
import { useEffect, useState } from "react";
import Button from "@/components/common/button";
import { Text } from "@/components/ui/typo";
import { Box, Flex } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import { resizedCanvasWidthHeight } from "@/utils/canva/resizedCanvasWidthHeight";
import { STORAGE_URL } from "@/lib/api";
import {
  globalToRosPoints,
  rosToGlobalPoints,
} from "@/utils/canva/manipulatePoint";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import SecondaryButton from "@/components/button/SecondaryButton";
import apolloClient from "@/lib/apolloClient";
import { useMutation } from "@apollo/client";
import { CREATE_ZONE, DELETE_ZONE, UPDATE_ZONE } from "@/graphql/mutation/zone";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import { MdOutlineInfo } from "react-icons/md";
import useAuth from "@/hooks/useAuth";
import useLocation from "@/hooks/useLocation";

const ZoneView = ({
  selectedLocation,
  locationZones,
  setIsZoneManagement,
  setCreateZoneOpen,
  handleRefresh,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [canvas, setCanvas] = useState(null);
  const [polygonTitle, setPolygonTitle] = useState("");
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [saveChangeModalOpen, setSaveChangeModalOpen] = useState(false);
  const [existModalOpen, setExistModalOpen] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [deletePolygonList, setDeletePolygonList] = useState([]);
  const [tipShow, setTipShow] = useState(false);
  const canvasWidth = 600;
  const canvasHeight = 600;
  const location = useLocation();

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
      canvas.clear();
      renderPolygons();
      canvas.off("mouse:wheel");
    }
  }, [canvas, locationZones]);

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
            setupPolygonEditing(poly);
          }
          addTitleToPolygon(poly, zone.title);
        }
      });
    }
  };

  function setupPolygonEditing(polygon) {
    polygon.edit = false;

    polygon.toggleEditMode = function () {
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
          polygon.cornerColor = "#BFA01D";
          polygon.cornerStyle = "rect";
          polygon.controls = fabric.Object.prototype.controls;
        }
        polygon.hasBorders = !polygon.edit;
        canvas.requestRenderAll();
      }
    };

    polygon.on("modified", () => updateTextPosition(polygon));
    polygon.on("moving", () => updateTextPosition(polygon));
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
      fill: "#7E6E3C",
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

  function updateTextPosition(polygon) {
    const text = findTitleText(polygon);
    if (text) {
      text.set({
        left: polygon.left + (polygon.width * polygon.scaleX) / 2,
        top: polygon.top + (polygon.height * polygon.scaleY) / 2,
      });
      text.setCoords();
      canvas.requestRenderAll();
    }
  }

  function findTitleText(polygon) {
    if (canvas) {
      const textObjects = canvas.getObjects("text");
      return textObjects.find((text) => text.relatedObject === polygon);
    }
    return null;
  }

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

  function openEditModal() {
    const selectedP = canvas.getActiveObject();

    if (selectedP && selectedP.type === "polygon") {
      setSelectedPolygon(selectedP);
      setPolygonTitle(selectedP.title);
      setEditModalIsOpen(true);
    } else {
      toast.error("please select a zone");
    }
  }

  function handlePolygonTitleChange(event) {
    setPolygonTitle(event.target.value);
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

  const [createZoneAction] = useMutation(CREATE_ZONE, {
    client: apolloClient,
    onCompleted: () => {},
    onError: (error) => {
      console.log("error", error);
    },
  });

  const [updateZoneAction] = useMutation(UPDATE_ZONE, {
    client: apolloClient,
    onCompleted: () => {},
    onError: (error) => {
      console.log("error", error);
    },
  });
  const [deleteZoneAction] = useMutation(DELETE_ZONE, {
    client: apolloClient,
    onCompleted: () => {},
    onError: (error) => {
      console.log("error", error);
    },
  });

  async function viewAllZones() {
    if (canvas) {
      const allPolygons = [];
      canvas.forEachObject(async function (obj) {
        if (obj.type === "polygon") {
          const reScaleHZPoints = globalToRosPoints(
            obj.points,
            selectedLocation?.map,
            canvas,
            "other",
            selectedLocation.mapMetaData
          );
          const polygonDetails = {
            title: obj.title,
            location: parseInt(selectedLocation?.id),
            points: reScaleHZPoints,
            type: "cleaning",
            order: locationZones.length + 1,
            name: obj.title,
          };

          if (obj.id != "") {
            await updateZoneAction({
              variables: {
                id: obj.id,
                data: polygonDetails,
              },
            });
          } else {
            await createZoneAction({
              variables: {
                data: polygonDetails,
              },
            });
          }
          allPolygons.push(polygonDetails);
        }
        handleRefresh();
        setIsZoneManagement(false);
      });
      if (deletePolygonList.length > 0) {
        deletePolygonList.map(async (item) => {
          await deleteZoneAction({
            variables: {
              id: item?.id,
            },
          });
        });
      }
      const res = await location.updateLocation(selectedLocation?.id, {
        modifiedByUser: user?.id,
      });
      toast.success("zones are updated");
    }
  }

  function closeDeleteModal() {
    setDeleteModalIsOpen(false);
  }

  function closeSaveModal() {
    setSaveChangeModalOpen(false);
  }

  function handleDeletePolygon() {
    if (canvas) {
      const selectedObject = canvas.getActiveObject();
      if (selectedObject) {
        canvas.forEachObject(function (obj) {
          if (obj.type === "text" && obj.relatedObject === selectedObject) {
            canvas.remove(obj);
          }
        });
        canvas.remove(selectedObject);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        setDeleteModalIsOpen(false);
        setDeletePolygonList([...deletePolygonList, selectedObject]);
      }
    }
  }

  return (
    <Box className="overflow-hidden">
      <Page
        title={
          <div className="flex items-center gap-4">
            <FaChevronLeft
              color="text-primary"
              className="cursor-pointer"
              onClick={() => setExistModalOpen(true)}
            />
            <span className="text-titleFontColor w-full text-lg font-semibold">
              {selectedLocation?.name}
            </span>
          </div>
        }
      >
        <Box className="pl-6 pt-6">
          <Button onClick={() => setSaveChangeModalOpen(true)}>
            <Text className="text-white">Save Changes</Text>
          </Button>
        </Box>
        <Flex direction="column" justify="center" align="center">
          <Box className="w-[90%] pb-2">
            <Flex align="end" justify="end" gap="2">
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
          </Box>
          <Box className="bg-gray/20 max-w-[90%]">
            <div className="flex flex-col items-center justify-center max-w-[80%]">
              <canvas id="canvas"></canvas>
            </div>
          </Box>
        </Flex>

        <Flex justify="between" className="px-[5%] mt-4">
          <Button onClick={setCreateZoneOpen}>
            <Text className="text-white">Create Zone</Text>
          </Button>
          <Flex gap="2">
            <Box className="pl-6">
              <Button onClick={openEditModal}>
                <Text className="text-white">Edit Name</Text>
              </Button>
            </Box>
            <SecondaryButton
              onClick={() => {
                if (canvas) {
                  const selectedObject = canvas.getActiveObject();
                  if (selectedObject && selectedObject.type === "polygon") {
                    selectedObject.toggleEditMode();
                  } else {
                    toast.error("please select a zone");
                  }
                }
              }}
            >
              <Text>Zone Edit Mode</Text>
            </SecondaryButton>
            <Button
              onClick={() => {
                if (canvas) {
                  const selectedPolygon = canvas.getActiveObject();
                  if (selectedPolygon && selectedPolygon.type === "polygon") {
                    setSelectedPolygon(selectedPolygon);
                    setDeleteModalIsOpen(true);
                  } else {
                    toast.error("please select a zone");
                  }
                }
              }}
              className=" py-2 px-5 rounded-xl text-red-1 border border-red-1"
            >
              <Text>Delete Selected Zone</Text>
            </Button>
          </Flex>
        </Flex>
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
      </Page>
      <Dialog.Root open={editModalIsOpen} onOpenChange={setEditModalIsOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-40" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40%]">
            <Dialog.Title className="text-lg font-semibold">
              Edit Zone
            </Dialog.Title>
            <div className="mt-4">
              <Text className="text-sm font-semibold text-gray-700 pb-1">
                Zone name
              </Text>

              <input
                type="text"
                value={polygonTitle}
                onChange={handlePolygonTitleChange}
                className="relative z-10 w-full text-sm text-bodyTextColor border-2 border-gray rounded-[10px] h-[45px] py-[12px] px-[15px] focus:outline-none"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button onClick={handleEditPolygon}>
                <Text className="text-white">Save Changes</Text>
              </Button>
              <SecondaryButton onClick={closeEditModal}>
                <Text>Cancel</Text>
              </SecondaryButton>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={deleteModalIsOpen} onOpenChange={setDeleteModalIsOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-40" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40%]">
            <Dialog.Title className="text-lg font-semibold">
              Delete Zone
            </Dialog.Title>
            <div className="mt-4">
              <Text className="text-sm font-semibold text-gray-700 pb-1">
                {selectedPolygon?.title}
              </Text>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button onClick={handleDeletePolygon}>
                <Text className="text-white">Delete</Text>
              </Button>
              <SecondaryButton onClick={closeDeleteModal}>
                <Text>Cancel</Text>
              </SecondaryButton>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root
        open={saveChangeModalOpen}
        onOpenChange={setSaveChangeModalOpen}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-40" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40%]">
            <Dialog.Title className="text-lg font-semibold">
              Save Changes?
            </Dialog.Title>
            <div className="mt-4">
              <Text className="text-sm font-semibold text-gray-700 pb-1">
                Do you want to save the changes you made to the zone? Your
                updates will be applied, and the previous version will be
                overwritten.
              </Text>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button onClick={viewAllZones}>
                <Text className="text-white">Save</Text>
              </Button>
              <SecondaryButton onClick={closeSaveModal}>
                <Text>Cancel</Text>
              </SecondaryButton>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root open={existModalOpen} onOpenChange={setExistModalOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-40" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40%]">
            <Dialog.Title className="text-lg font-semibold">
              Are you sure you want to go back?
            </Dialog.Title>
            <div className="mt-4">
              <Text className="text-sm font-semibold text-gray-700 pb-1">
                If you exit, your changes will be lost.
              </Text>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button onClick={() => setIsZoneManagement(false)}>
                <Text className="text-white">Discard</Text>
              </Button>
              <SecondaryButton onClick={() => setExistModalOpen(false)}>
                <Text>Keep Editing</Text>
              </SecondaryButton>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default ZoneView;
