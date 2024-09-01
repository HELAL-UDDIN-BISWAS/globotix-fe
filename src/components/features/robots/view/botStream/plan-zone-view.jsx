import { Text } from "@/components/ui/typo";
import { cn } from "@/utils/cn";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { MdDragIndicator } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { produce } from "immer";
import Button from "@/components/common/button";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import SecondaryButton from "@/components/button/SecondaryButton";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ZoneViewBotPage from "./zone-view";
import Home from "./index";
import CameraView from "./camera-four-images";
import polygonCoordinates from "./data";
import { rosToGlobalPoints } from "@/utils/canva/manipulatePoint";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import axios from "axios";
import ZonePlanViewPage from "./zone-plan-view";
import PlanFooter from "./planFooter";
import PlanCameraView from "./plan-camera-four-images";
import { resizedCanvasWidthHeight } from "@/utils/canva/resizedCanvasWidthHeight";
import { STORAGE_URL } from "@/lib/api";
dayjs.extend(isSameOrBefore);
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const PlanZoneView = ({
  selectedZoneToClean = [],
  setSelectedZoneToClean,
  selectedZoneToBlock = [],
  setSelectedZoneToBlock,
  // planDetail,
  // setPlanDetail,
  successOpen,
  setSuccessOpen,
  defaultRobot,
  editEnable,
  setEditEnable,
  id,
  name = "",
  isGoBack = false,
}) => {
  const router = useRouter();
  const [canvas, setCanvas] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chosenDate, setChosenDate] = useState(new Date());
  const [hours, setHours] = useState(new Date().getHours());
  const [minutes, setMinutes] = useState(new Date().getMinutes() - 1);
  const [seconds, setSeconds] = useState(new Date().getSeconds());
  const [speed, setSpeed] = useState(1);
  const [changeTime, setChangeTime] = useState(true);
  const [locationById, setLocationById] = useState(null);
  const [cameraList, setCameraList] = useState([]);
  const [pathData, setPathData] = useState([]);
  const [baseName, setBaseName] = useState(defaultRobot?.baseName || "");
  const [xPos, setXPos] = useState(0.0);
  const [yPos, setYPos] = useState(0.0);
  const [reScaleHZLinePoints, setReScaleHZLinePoints] = useState([]);
  const [passedTimestamp, setPassedTimestamp] = useState([]);
  // Get the current date and time in UTC
  const now = new Date();

  // Convert to Singapore timezone (GMT+8)

  const [startTime, setStartTime] = useState(
    dayjs().subtract(10, "minute").valueOf() * 1000000 // Convert to nanoseconds
  );

  const [endTime, setEndTime] = useState(
    dayjs().valueOf() * 1000000 // Current time in nanoseconds
  );
  const [fetchTime, setFetchTime] = useState(startTime / 1000000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayCalendar, setDisplayCalendar] = useState(false);
  // const arrowUrl = "/upload/images/robot.png";
  // const arrowUrlRight = "/upload/images/robotRight.png";
  // const arrowUrlLeft = "/upload/images/robotLeft.png";
  // const arrowUrlUp = "/upload/images/robotUp.png";
  const arrowUrl1 = "/upload/images/robotPic1.jpg";
  // let pathData = polygonCoordinates?.map((eachEntry) => {
  //   return {
  //     ...eachEntry,
  //     x: eachEntry.position_x,
  //     y: eachEntry.position_y,
  //   };
  // });
  // let currentStep = 0;
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTimestamp, setCurrentTimestamp] = useState(
    dayjs().subtract(10, "minute").valueOf() * 1000000
  );
  //let isPlaying = false;
  let intervalId = null;
  //let speed = 3;
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  //let arrowImage = null; // Variable to store the last added arrow image
  const [error, setError] = useState(null);
  const [arrowImage, setArrowImage] = useState([]);

  const fetchData = async (source, comeFrom) => {
    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-robot-monitoring-history/${defaultRobot?.baseName}/${startTime}/${endTime}`,
          {
            cancelToken: source.token,
          }
          // `${process.env.NEXT_PUBLIC_API_URL}/api/get-robot-monitoring-history/base7/1722913531107185200}/1722913721107161300`
        )
        .then((response) => {
          if (!!changeTime) {
            const prepareEntries =
              !!response.data.data &&
              response.data.data.map((eachEntry) => {
                return {
                  ...eachEntry,
                  x: eachEntry.position_x,
                  y: eachEntry.position_y,
                };
              });
            !!response.data.data && setPathData(prepareEntries);

            setChangeTime(!changeTime);
          } else {
            setPathData((prevPathData) => {
              const existingTimestamps = new Set(
                prevPathData.map((entry) => entry.timestamp)
              );
              const newEntries =
                (!!response.data.data &&
                  response.data.data.filter(
                    (entry) => !existingTimestamps.has(entry.timestamp)
                  )) ||
                [];
              const prepareEntries = newEntries.map((eachEntry) => {
                return {
                  ...eachEntry,
                  x: eachEntry.position_x,
                  y: eachEntry.position_y,
                };
              });
              const finalEntriesPath =
                prepareEntries.length > 0
                  ? [...prevPathData, ...prepareEntries]
                  : prevPathData;

              finalEntriesPath.sort((a, b) => a.timestamp - b.timestamp);
              return finalEntriesPath;
            });
          }
        });
    } catch (err) {
      setError(err);
    }
  };
  useEffect(() => {}, []);

  useEffect(() => {
    if (!!defaultRobot?.locations && !locationById) {
      setLocationById(defaultRobot?.locations[0]);
      if (!!changeTime) {
        handleDateTimeSelection(startTime);
        const source = axios.CancelToken.source();
        fetchData(source, " initial");
        setChangeTime(!changeTime);
        return () => {
          source.cancel("Request canceled due to component unmounting.");
        };
      }
    }
  }, [defaultRobot]);
  useEffect(() => {
    if (
      pathData.length > 0 &&
      !!locationById?.map &&
      !!locationById.mapMetaData
    ) {
      const mapPoints = rosToGlobalPoints(
        pathData,
        locationById?.map,
        canvas,
        "other",
        locationById.mapMetaData
      );

      setReScaleHZLinePoints(mapPoints);
    } else {
      stopSimulation();
      fetchData();
    }
  }, [pathData, locationById]);

  // Function to handle date-time selection logic
  const handleDateTimeSelection = async (chosenDateTime) => {
    try {
      if (chosenDateTime <= startTime) {
        setCurrentStep(0); // Reset to the first step
        setCurrentTimestamp(pathData[0]?.timestamp || null); // Set to the first timestamp
        setChangeTime(false);
      }
    } catch (err) {
      console.error("Error in handling date-time selection:", err);
    }
  };

  useEffect(() => {
    const startTimeMs = dayjs(chosenDate).valueOf();

    const endTimeMs = new Date(chosenDate);
    endTimeMs.setMinutes(endTimeMs.getMinutes() + 10); // Set fetchData for 10 mins long duration

    // Convert milliseconds to nanoseconds
    const startTimeNs = startTimeMs * 1000000;
    const endTimeNs = endTimeMs * 1000000;

    // Set the start and end time using the state or however you're using them
    setStartTime(startTimeNs);
    setEndTime(endTimeNs);

    if (fetchTime && !!changeTime) {
      // Update fetchTime to be 5 minutes ahead of chosenDate whenever selecting date time
      const newFetchTime = new Date(chosenDate);
      newFetchTime.setMinutes(newFetchTime.getMinutes() + 5);

      // console.log(
      //   "newFetchTime2 if ",
      //   dayjs(newFetchTime).format("MMM D YYYY h:mm:ss A")
      // );

      !!changeTime && setFetchTime(newFetchTime);
    } else if (fetchTime && new Date(chosenDate) >= fetchTime) {
      // Update fetchTime to be 5 minutes ahead of the current fetchTime
      // when chosenDate is more than fetchTime, means that fetchTime interval 5 mins is completed
      //and next 5mins again
      const newFetchTime = new Date(fetchTime);
      newFetchTime.setMinutes(newFetchTime.getMinutes() + 5);

      // console.log(
      //   "newFetchTime2 elseif ",
      //   dayjs(newFetchTime).format("MMM D YYYY h:mm:ss A")
      // );
      //fetchData();
      setFetchTime(newFetchTime);
    }

    // Example usage
  }, [chosenDate, changeTime]);

  useEffect(() => {
    // Monitor the timestamp of the current step and compare with fetchTime
    if (!!changeTime) {
      const source = axios.CancelToken.source();
      fetchData(source, " changeTime");
      setChangeTime(!changeTime);
      return () => {
        source.cancel("Request canceled due to component unmounting.");
      };
    }
    //currentStep, currentTimestamp,
  }, [startTime]);
  useEffect(() => {
    const source = axios.CancelToken.source();
    // Monitor the timestamp of the current step and compare with fetchTime
    fetchData(source, " fetchTime");
    !!changeTime && setChangeTime(false);
    const interval = setInterval(() => {
      if (fetchTime && new Date(chosenDate) >= fetchTime) {
        // Update fetchTime to be 5 minutes ahead of the current existing fetchTime completed
        const newFetchTime = new Date(fetchTime);
        newFetchTime.setMinutes(newFetchTime.getMinutes() + 5);

        // console.log(
        //   "newFetchTime2 if fetchTIme ",
        //   dayjs(newFetchTime).format("MMM D YYYY h:mm:ss A")
        // );
        ////fetchData();
        setFetchTime(newFetchTime);
      }
    }, 1000); // Check every second

    return () => {
      clearInterval(interval);
      source.cancel("Request canceled due to component unmounting.");
    };
  }, [fetchTime]);
  // Logic to handle the chosen date-time

  useEffect(() => {
    if (!isGoBack) {
      // currentStep < reScaleHZLinePoints?.length - 2;
      // !!reScaleHZLinePoints[currentStep] &&
      //   !!reScaleHZLinePoints[currentStep + 1].y &&
      //   addArrowAtPoint(
      //     reScaleHZLinePoints[currentStep],
      //     reScaleHZLinePoints[currentStep + 1]
      //   );
    } else {
      stopSimulation();
    }
    //
  }, [isGoBack, passedTimestamp]);
  useEffect(() => {
    if (!isGoBack && !!isPlaying && !!pathData.length) {
      console.log("pathData", pathData.length);
      currentStep < pathData.length - 2 && handlePlay();
    } else {
      stopSimulation();
    }
    //speed
  }, [isPlaying, currentStep, chosenDate]);

  const addArrowAtPoint = (startPoint, endPoint) => {
    // Calculate the angle in radians
    const angleRadians = Math.atan2(
      endPoint.y - startPoint.y,
      endPoint.x - startPoint.x
    );
    // const angleRadians = Math.atan2(endPoint.y, endPoint.x);
    // Convert to degrees
    // / Math.PI
    const angleDegrees = angleRadians * (180 / Math.PI);

    fabric.Image.fromURL(arrowUrl1, function (img) {
      img.set({
        left: (startPoint.x + endPoint.x) / 2, // Center the arrow between the two points
        top: (startPoint.y + endPoint.y) / 2,
        // left: endPoint.x, // Center the arrow between the two points
        // top: endPoint.y,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
        angle: angleDegrees, // Rotate the image to align with the line
        scaleX: 0.0115, // Scale down the arrow size
        scaleY: 0.0115, // Scale down the arrow size
      });
      // console.log("arrowImage...", !!arrowImage);
      // console.log("canvas...", !!canvas);
      // console.log(
      //   "canvas.contains(arrowImage)...",
      //   !!canvas.contains(arrowImage)
      // );
      // Remove the previous arrow image if it exists
      canvas.forEachObject(function (obj) {
        if (obj.type === "image") {
          canvas.remove(obj);
        }
      });

      // Add the new arrow image to the canvas
      if (canvas) {
        canvas.add(img);
        // Ensure the canvas is updated
        canvas.requestRenderAll();
      }

      // Update the reference to the newly added arrow image
      setArrowImage([...arrowImage, img]);
    });
  };

  const pauseSimulation = () => {
    clearInterval(intervalId);
    setIsPlaying(false);
  };
  const stopSimulation = () => {
    if (!isGoBack) {
      pauseSimulation();
      // let index =
      //   !!currentTimestamp &&
      //   pathData.length > 2 &&
      //   pathData.findIndex((item) => item.timestamp === currentTimestamp);
      // let i = !currentTimestamp || index === -1 ? 0 : index;

      // if (pathData.length > 2 && i < pathData.length - 2 && !!isPlaying) {
      //   drawRoute(i);
      // }
    }
  };
  // Assuming canvas and other necessary variables are defined
  // Function to draw the route based on pathData and currentStep
  // const drawRoute = (i) => {
  //   if (!isGoBack) {
  //     if (
  //       reScaleHZLinePoints.length > 2 &&
  //       i < reScaleHZLinePoints.length - 2 &&
  //       i < pathData.length - 2
  //     ) {
  //       const startPoint = reScaleHZLinePoints[i];
  //       const endPoint = reScaleHZLinePoints[i + 1];
  //       const currentTime = pathData[i].timestamp;

  //       // Draw the line between startPoint and endPoint
  //       const line = new fabric.Line(
  //         [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
  //         {
  //           stroke: "#D95723", // Orange-red stroke color
  //           strokeWidth: 20, // Width of the line
  //           // fill: "lightblue", // Blue fill for the path
  //           selectable: false, // Set to true if you want the line to be selectable
  //           evented: false, // Set to true if you want the line to respond to events
  //           lockMovementX: true, // Lock horizontal movement
  //           lockMovementY: true, // Lock vertical movements
  //           lockScalingX: true, // Lock horizontal scaling
  //           lockScalingY: true, // Lock vertical scaling
  //           lockRotation: true, // Lock rotation
  //           hasControls: false, // Hide control handles
  //           hasBorders: false, // Hide borders around the line
  //           shadow: {
  //             color: "lightblue", // Shadow color (black with 50% opacity) #599CFF
  //             blur: 2, // Blur level
  //             offsetX: 5, // Horizontal shadow offset
  //             offsetY: 5, // Vertical shadow offset
  //           },
  //         }
  //       );

  //       // Construct the SVG path string using the coordinates
  //       let pathString = `L ${startPoint.x} ${startPoint.y}`;

  //       pathString += ` L ${endPoint.x} ${endPoint.y}`;

  //       const path = new fabric.Path(pathString, {
  //         stroke: "#D95723", // Stroke color of the path (orange-red)
  //         strokeWidth: 20, // Width of the stroke
  //         // fill: "black", // No fill for the path
  //         selectable: false, // Non-selectable
  //         evented: false, // No events triggered
  //         opacity: 0.5, // Set opacity to 50%
  //         // shadow: {
  //         //   color: "#D95723", // Shadow color (black with 50% opacity) #599CFF
  //         //   blur: 2, // Blur level
  //         //   offsetX: 5, // Horizontal shadow offset
  //         //   offsetY: 5, // Vertical shadow offset
  //         // },
  //       });

  //       //   // Add a blue background color to the path
  //       path.set({
  //         stroke: "#D95723", // Orange-red stroke color
  //         fill: "black", // Blue fill for the path
  //       });

  //       // // Load the robot image and set it at the last point of the path

  //       if (
  //         canvas &&
  //         !!dayjs(pathData[i + 1].timestamp).isSameOrBefore(dayjs(chosenDate))
  //       ) {
  //         // Add the line to the canvas
  //         //canvas.add(rect);
  //         //canvas.add(line);

  //         // Add the path to the canvas
  //         canvas.add(path);
  //         setCameraList(pathData[i + 1]);
  //         // Duration of the animation in milliseconds
  //         const duration = 1000 / parseInt(speed); // 5 seconds

  //         // Animation function
  //         const animateLine = () => {
  //           setXPos(pathData[i + 1].x);
  //           setYPos(pathData[i + 1].y);
  //           line.animate(
  //             { x2: endPoint.x, y2: endPoint.y }, // properties to animate
  //             {
  //               duration: duration,
  //               onChange: canvas.renderAll.bind(canvas), // render the canvas on change
  //               easing: fabric.util.ease.easeInOutQuad, // easing function for smooth animation
  //             }
  //           );
  //           console.log("drawing...");
  //         };

  //         // Start the animation
  //         if (!!endPoint.y) {
  //           addArrowAtPoint(startPoint, endPoint);
  //           animateLine();
  //           //pauseSimulation();

  //           if (
  //             currentStep < reScaleHZLinePoints.length - 2 &&
  //             currentStep < pathData.length - 2
  //           ) {
  //             setCurrentStep((prevCurrentStep) => prevCurrentStep + 1);
  //             setCurrentTimestamp(pathData[i + 1].timestamp);
  //           }
  //         }
  //       }
  //     }
  //   }
  // };

  const drawRoute = (i) => {
    // console.log("isPlaying...", isPlaying);
    if (!!!isPlaying) return; // Do nothing if not playing
    if (!isGoBack && !!isPlaying) {
      // console.log("isPlaying...");
      if (
        reScaleHZLinePoints.length > 2 &&
        i < reScaleHZLinePoints.length - 2 &&
        i < pathData.length - 2
      ) {
        const startPoint = reScaleHZLinePoints[i];
        const endPoint = reScaleHZLinePoints[i + 1];
        // console.log("startPoint...");
        // console.log(
        //   "timestamp...",
        //   dayjs(pathData[i + 1].timestamp / 1000000).valueOf()
        // );
        // console.log("chosenDate...", dayjs(chosenDate).valueOf());
        if (
          dayjs(pathData[i + 1].timestamp / 1000000).valueOf() <
          dayjs(chosenDate).valueOf()
        ) {
          const line = new fabric.Line(
            [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
            {
              stroke: "#D95723", // Orange-red stroke color
              strokeWidth: 5, // Width of the line
              opacity: 0.5,
              // fill: "lightblue", // Blue fill for the path
              selectable: false, // Set to true if you want the line to be selectable
              evented: false, // Set to true if you want the line to respond to events
              lockMovementX: true, // Lock horizontal movement
              lockMovementY: true, // Lock vertical movements
              lockScalingX: true, // Lock horizontal scaling
              lockScalingY: true, // Lock vertical scaling
              lockRotation: true, // Lock rotation
              hasControls: false, // Hide control handles
              hasBorders: false, // Hide borders around the line
              // shadow: {
              //   color: "#D95723", // Shadow color (black with 50% opacity) #599CFF
              //   blur: 2, // Blur level
              //   offsetX: 5, // Horizontal shadow offset
              //   offsetY: 5, // Vertical shadow offset
              // },
            }
          );
          const pathString = `L ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`;
          const path = new fabric.Path(pathString, {
            stroke: "#D95723",
            strokeWidth: 5,
            selectable: false,
            evented: false,
            opacity: 0.5,
            // shadow: {
            //   color: "#D95723",
            //   blur: 2,
            //   offsetX: 5,
            //   offsetY: 5,
            // },
          });

          // Animate the line
          const duration = 1000 / parseInt(speed);
          canvas.add(path);
          // console.log("isPlaying.....");
          const animateLine = () => {
            console.log("isPlaying.....");
            setXPos(pathData[i + 1].x);
            setYPos(pathData[i + 1].y);
            line.animate(
              { x2: endPoint.x, y2: endPoint.y },
              {
                duration,
                onChange: canvas.renderAll.bind(canvas),
                easing: fabric.util.ease.easeInOutQuad,
              }
            );
          };

          // Define the properties you want to animate
          // const animationProperties = {
          //   // You can animate properties like position, path points, opacity, etc.
          //   left: endPoint.x, // New left position of the path
          //   top: endPoint.y, // New top position of the path
          // };

          // // Define the duration and easing for the animation
          // const animationOptions = {
          //   duration: duration, // Duration of the animation in milliseconds
          //   onChange: canvas.renderAll.bind(canvas), // Re-render the canvas during the animation
          //   easing: fabric.util.ease.easeInOutQuad, // Easing function for smooth animation
          // };

          // // Adjust `currentStep` if `chosenDate` is greater than the current timestamp
          // const timeDifference = dayjs(chosenDate).diff(
          //   dayjs(currentTimestamp),
          //   "minute"
          // );
          // const stepsToSkip = Math.floor(timeDifference / 10); // Calculate how many steps to skip

          // if (stepsToSkip > 0) {
          //   i += stepsToSkip; // Increase index to skip ahead
          // }
          // Check if currentTimestamp is same or before system timestamp

          if (!!endPoint.y && !!isPlaying) {
            // console.log("isPlaying..addArrowAtPoint...");
            addArrowAtPoint(startPoint, endPoint);
            animateLine();
            // Start the animation
            //path.animate(animationProperties, animationOptions);
            // Use Immer.js to update multiple states immutably
            // setCameraList(
            //   produce((draft) => {
            //     draft = pathData[currentStep + 1];
            //     return draft;
            //   })
            // );
            // setCurrentStep(
            //   produce((draft) => {
            //     draft = Math.min(currentStep + 1, pathData.length - 2);
            //     return draft;
            //   })
            // );
            // setCurrentTimestamp(
            //   produce((draft) => {
            //     draft = pathData[currentStep + 1]?.timestamp;
            //     return draft;
            //   })
            // );
          }
          if (
            !!isPlaying &&
            dayjs(pathData[i + 1].timestamp / 1000000).valueOf() <
              dayjs(chosenDate).valueOf()
          ) {
            // Increase currentStep if the condition is met
            // setCameraList(
            //   produce((draft) => {
            //     // draft = pathData[currentStep + 1];
            //     draft = pathData[Math.min(i + 1, pathData.length - 2)];
            //     return draft;
            //   })
            // );

            // setCurrentTimestamp(
            //   produce((draft) => {
            //     // draft = pathData[currentStep + 1]?.timestamp;
            //     draft =
            //       pathData[Math.min(i + 1, pathData.length - 1)].timestamp;
            //     return draft;
            //   })
            // );
            // setCurrentStep(
            //   produce((draft) => {
            //     draft = Math.min(currentStep + 1, pathData.length - 2);

            //     return draft;
            //   })
            // );
            setCameraList(pathData[Math.min(i + 1, pathData.length - 1)]);
            setCurrentTimestamp(
              pathData[Math.min(i + 1, pathData.length - 1)].timestamp
            );
            setCurrentStep((prevCurrentStep) =>
              Math.min(prevCurrentStep + 1, pathData.length - 2)
            );
          }
        }
      }
    }
  };

  const handlePlay = () => {
    console.log(
      pathData.length,
      " currentStep.. ",
      currentStep,
      " p.........",
      pathData.length > 2 &&
        !isGoBack &&
        currentStep < pathData.length - 1 &&
        currentStep < reScaleHZLinePoints.length - 1 &&
        reScaleHZLinePoints.length > 2 &&
        !!isPlaying
    );

    let index =
      !!currentTimestamp &&
      pathData.findIndex((item) => item.timestamp === currentTimestamp);
    let i = !currentTimestamp || index === -1 ? 0 : index;

    if (
      pathData.length > 2 &&
      !isGoBack &&
      currentStep < pathData.length - 2 &&
      currentStep < reScaleHZLinePoints.length - 2 &&
      reScaleHZLinePoints.length > 2 &&
      !!isPlaying
    ) {
      // intervalId = setInterval(() => {
      // Continue drawing from the currentStep

      drawRoute(currentStep);
      // }, 1000);
    }
  };

  const handleSpeed = (e) => {
    setSpeed(parseInt(e.target.value));

    if (isPlaying) {
      pauseSimulation();
      currentStep < pathData.length - 2 && handlePlay();
    }
  };

  return (
    <Box className="pt-4 overflow-hidden ">
      <Box className="col-span-2 shadow h-full rounded-xl relative ">
        <ZonePlanViewPage
          defaultRobot={defaultRobot}
          pathData={pathData}
          locationById={locationById}
          selectedZoneToClean={selectedZoneToClean}
          setSelectedZoneToClean={setSelectedZoneToClean}
          selectedZoneToBlock={selectedZoneToBlock}
          setSelectedZoneToBlock={setSelectedZoneToBlock}
          // removeZone={removeZone}
          // setRemoveZone={setRemoveZone}
          // unselectZone={unselectZone}
          // setUnselectZone={setUnselectZone}
          editEnable={editEnable}
          setEditEnable={setEditEnable}
          // planDetail={planDetail}
          canvas={canvas}
          setCanvas={setCanvas}
          setLocationById={setLocationById}
          setChangeTime={setChangeTime}
          changeTime={changeTime}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setIsPlaying={setIsPlaying}
        />
        <PlanFooter
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          chosenDate={chosenDate}
          setChosenDate={setChosenDate}
          hours={hours}
          setHours={setHours}
          minutes={minutes}
          setMinutes={setMinutes}
          seconds={seconds}
          setSeconds={setSeconds}
          speed={speed}
          setSpeed={setSpeed}
          handlePlay={handlePlay}
          handleSpeed={handleSpeed}
          setChangeTime={setChangeTime}
          changeTime={changeTime}
          pathData={pathData}
          setPathData={setPathData}
          setCurrentStep={setCurrentStep}
          xPos={xPos}
          yPos={yPos}
          displayCalendar={displayCalendar}
          setDisplayCalendar={setDisplayCalendar}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          cameraList={cameraList}
          currentStep={currentStep}
        />
      </Box>
      {/* )} */}
      {/* </Grid>
      </Flex> */}
    </Box>
  );
};
export default PlanZoneView;
