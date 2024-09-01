import { Text } from "@/components/ui/typo";
import { cn } from "@/utils/cn";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { MdDragIndicator } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
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

dayjs.extend(isSameOrBefore);
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const StreamedZoneView = ({
  selectedZoneToClean = [],
  setSelectedZoneToClean,
  selectedZoneToBlock = [],
  setSelectedZoneToBlock,
  removeZone = [],
  setRemoveZone,
  setUnselectZone,
  unselectZone,
  planDetail,
  setSuccessOpen,
  defaultRobot,
  id,
  selectedRobot,
  createHandler,
  editEnable,
  setEditEnable,
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
  const [speed, setSpeed] = useState(3);
  const [changeTime, setChangeTime] = useState(false);
  const [locationById, setLocationById] = useState(null);
  const [cameraList, setCameraList] = useState([]);
  const [pathData, setPathData] = useState([]);
  const [baseName, setBaseName] = useState(
    planDetail?.robot?.attributes?.baseName || ""
  );
  // Get the current date and time in UTC
  const now = new Date();

  // Convert to Singapore timezone (GMT+8)

  const [startTime, setStartTime] = useState(
    (new Date().getMilliseconds() - 600000) * 1000000
    // 12341234
  );
  const [endTime, setEndTime] = useState(
    new Date().getMilliseconds() * 1000000
  );
  const arrowUrl = "/upload/images/robot.png";
  //let pathData = polygonCoordinates;
  // let currentStep = 0;
  const [currentStep, setCurrentStep] = useState(0);
  let isPlaying = false;
  let intervalId = null;
  //let speed = 3;
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  const tabItem = [
    {
      label: "Camera View",
      value: "clean",
      count: selectedZoneToClean.length,
    },
    {
      label: "Zone View",
      value: "block",
      count: selectedZoneToBlock.length,
    },
  ];

  const [error, setError] = useState(null);
  // console.log("planDetail...", planDetail?.robot?.attributes?.baseName);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-robot-monitoring-history/${planDetail?.robot?.attributes?.baseName}/${startTime}/${endTime}`
        // `${process.env.NEXT_PUBLIC_API_URL}/api/get-robot-monitoring-history/base7/1722913531107185200}/1722913721107161300`
      );
      // console.log("response...", response.data);
      // console.log("startTime...", startTime);
      // console.log("endTime...", endTime);
      // console.log("pathData...", pathData);

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
        return newEntries.length > 0
          ? [...prevPathData, ...newEntries]
          : prevPathData;
      });
      handlePlay();
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    // console.log("pathData after...", pathData);
    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData();
    }, 300000); // 6000 milliseconds = 6 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    //setPathData([]);
    setStartTime(dayjs(chosenDate).valueOf() * 1000000);
    setEndTime((dayjs(chosenDate).valueOf() + 60000) * 1000000);
    fetchData();
  }, [chosenDate]);

  const [selectedTab, setSelectedTab] = useState(tabItem[0].value);
  const addArrowAtPoint = (startPoint, endPoint) => {
    // Calculate the angle in radians
    const angleRadians = Math.atan2(
      endPoint.y - startPoint.y,
      endPoint.x - startPoint.x
    );
    //const angleRadians = Math.atan2(endPoint.y, endPoint.x);
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
  useEffect(() => {
    if (!isGoBack) {
      pauseSimulation();
      handlePlay();
    }
  }, [speed, isGoBack, pathData]);
  const updateRobotPosition = (subPoints) => {
    if (!isGoBack) {
      const reScaleHZLinePoints = rosToGlobalPoints(
        subPoints,
        locationById?.map,
        canvas,
        "other",
        locationById.mapMetaData
      );
      // console.log("drawing...", currentStep);
      // Convert points array to path data string
      // Assuming reScaleHZPoints is your array of points
      let i = 0;
      // Loop through the points array and draw lines between consecutive points
      for (i = 0; i < reScaleHZLinePoints.length - 1; i++) {
        const startPoint = reScaleHZLinePoints[i];
        const endPoint = reScaleHZLinePoints[i + 1];
        // console.log("startPoint...", startPoint);
        // console.log("endPoint...", endPoint);
        // Create a line object for each pair of consecutive points
        const line = new fabric.Line(
          [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
          {
            stroke: "red", // Color of the line "#D95723"
            strokeWidth: 15, // Width of the line
            selectable: false, // Set to true if you want the line to be selectable
            evented: false, // Set to true if you want the line to respond to events
            lockMovementX: true, // Lock horizontal movement
            lockMovementY: true, // Lock vertical movement
            lockScalingX: true, // Lock horizontal scaling
            lockScalingY: true, // Lock vertical scaling
            lockRotation: true, // Lock rotation
            hasControls: false, // Hide control handles
            hasBorders: false, // Hide borders around the line
          }
        );

        if (
          canvas &&
          !!dayjs(subPoints[i].timestamp).isSameOrBefore(dayjs(chosenDate))
        ) {
          // console.log(
          //   "dayIsSameBefore...",
          //   dayjs(subPoints[i].timestamp).isSameOrBefore(dayjs(chosenDate))
          // );
          // console.log("dayIsSameBefore...", subPoints[i].timestamp);
          // console.log(
          //   "dayIsSameBefore...",
          //   dayjs(subPoints[i].timestamp).format("MMM D YYYY h:mm:ss A")
          // );
          // console.log(
          //   "dayIsSameBefore...",
          //   dayjs(chosenDate).format("MMM D YYYY h:mm:ss A")
          // );
          canvas.add(line);
          setCameraList(subPoints[i]);
          // Duration of the animation in milliseconds
          const duration = parseInt(speed) * 3000; // 5 seconds

          // Animation function
          const animateLine = () => {
            line.animate(
              { x2: endPoint.x, y2: endPoint.y }, // properties to animate
              {
                // duration: duration,
                onChange: canvas.renderAll.bind(canvas), // render the canvas on change
                easing: fabric.util.ease.easeInOutQuad, // easing function for smooth animation
              }
            );
            console.log("drawing...");
          };

          // Start the animation
          !!endPoint.y && animateLine();
        }
      }

      // Add and rotate arrow at the midpoint of each line segment
      i == 0 &&
        !!reScaleHZLinePoints[reScaleHZLinePoints.length - 3] &&
        !!reScaleHZLinePoints[reScaleHZLinePoints.length - 2].y &&
        addArrowAtPoint(
          reScaleHZLinePoints[reScaleHZLinePoints.length - 3],
          reScaleHZLinePoints[reScaleHZLinePoints.length - 2]
        );
    }
  };

  const stopSimulation = () => {
    if (!isGoBack) {
      pauseSimulation();
      if (pathData.length > 0 && currentStep < pathData.length) {
        // currentStep = pathData.length - 1;
        // console.log("currentStep...", currentStep);
        const last = {
          ...pathData[currentStep],
          x: pathData[currentStep].position_x,
          y: pathData[currentStep].position_y,
        };
        updateRobotPosition([last]);
      }
    }
  };

  const handlePlay = () => {
    // console.log(
    //   "Chosen Date...",
    //   dayjs(chosenDate).format("MMM D YYYY h:mm:ss A")
    // );
    //if (!!isPlaying) isPlaying = false;
    // console.log("currentStep...", currentStep);
    // console.log("pathData...", pathData.length);
    // console.log("!isGoBack...", !isGoBack);
    // console.log("pathData.length > 0...", pathData.length > 0);
    console.log(
      pathData.length,
      " currentStep.. ",
      currentStep,
      " p.........",
      pathData.length > 0 && !isGoBack && currentStep < pathData.length - 1
    );
    if (pathData.length > 0 && !isGoBack && currentStep < pathData.length - 1) {
      // isPlaying = true;
      // intervalId = setInterval(() => {
      if (currentStep < pathData.length - 1) {
        const current = {
          ...pathData[currentStep],
          x: pathData[currentStep].position_x,
          y: pathData[currentStep].position_y,
        };
        const next = {
          ...pathData[currentStep + 1],
          x: pathData[currentStep + 1].position_x,
          y: pathData[currentStep + 1].position_y,
        };

        // currentStep < pathData.length - 1 &&
        //   setCurrentStep((prevCurrentStep) => prevCurrentStep + 1);

        updateRobotPosition([current, next]);
      } else {
        stopSimulation();
      }
      // }, 1000 / speed);
      if (currentStep < pathData.length - 1)
        setCurrentStep((prevStep) => prevStep + 1);
    } else {
      pauseSimulation();
      if (pathData.length > 0 && currentStep < pathData.length) {
        // currentStep = pathData.length - 1;
        const last = {
          ...pathData[currentStep],
          x: pathData[currentStep].position_x,
          y: pathData[currentStep].position_y,
        };
        !isGoBack && updateRobotPosition([last]);
      }
    }
    setChangeTime(changeTime);
  };
  const pauseSimulation = () => {
    isPlaying = false;
    clearInterval(intervalId);
  };

  const handleSpeed = (e) => {
    setSpeed(parseInt(e.target.value));

    if (isPlaying) {
      pauseSimulation();
      handlePlay();
    }
  };

  return (
    <Box className="pt-4 overflow-hidden ">
      {/* Tab */}
      {/* <Grid
        columns="2"
        className="border rounded-[10px] border-placeholder divide-placeholder w-[25%]"
      >
        {tabItem.map((item, index) => {
          return (
            <Flex
              className={cn(
                selectedTab == item.value
                  ? "bg-primary text-white rounded-[10px]"
                  : "text-placeholder",
                "p-2  text-sm"
              )}
              align="center"
              justify="center"
              key={index}
              onClick={() => setSelectedTab(item.value)}
            >
              {`${item.label} `}
            </Flex>
          );
        })}
      </Grid>
     Content */}

      {/* <Flex direction="column" justify="between" className="h-full ">
        <Grid className="h-full"> */}
      {/* {selectedTab == tabItem[0].value ? (
            <Box className="col-span-2 shadow h-full rounded-xl bg-white">
             
              <CameraView />
             
              <Home
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
              />
            </Box>
         
          (*/}
      <Box className="col-span-2 shadow h-full rounded-xl relative ">
        <div className="absolute right-4 mt-7 z-10 w-[20%]">
          <CameraView cameras={cameraList} />
        </div>
        <ZoneViewBotPage
          selectedZoneToClean={selectedZoneToClean}
          setSelectedZoneToClean={setSelectedZoneToClean}
          selectedZoneToBlock={selectedZoneToBlock}
          setSelectedZoneToBlock={setSelectedZoneToBlock}
          removeZone={removeZone}
          setRemoveZone={setRemoveZone}
          unselectZone={unselectZone}
          setUnselectZone={setUnselectZone}
          editEnable={editEnable}
          setEditEnable={setEditEnable}
          planDetail={planDetail}
          canvas={canvas}
          setCanvas={setCanvas}
          setLocationById={setLocationById}
          setChangeTime={setChangeTime}
          changeTime={changeTime}
        />
        <Home
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
        />
      </Box>
      {/* )} */}
      {/* </Grid>
      </Flex> */}
    </Box>
  );
};
export default StreamedZoneView;
