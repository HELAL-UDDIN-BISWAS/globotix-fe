import React, { useState, useEffect, useRef } from "react";
import styles from "./datepicker.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdArrowRight,
  MdOutlineCalendarToday,
  MdPause,
} from "react-icons/md";
import Calendar from "@/components/features/schedule/calendar";
import dayjs from "dayjs";
import CustomPicker from "./CustomPicker";
import PlanCameraView from "./plan-camera-four-images";

const PlanFooter = ({
  selectedDate,
  setSelectedDate,
  chosenDate,
  setChosenDate,
  hours,
  setHours,
  minutes,
  setMinutes,
  seconds,
  setSeconds,
  speed,
  setSpeed,
  canvas,
  setCanvas,
  handlePlay,
  handleSpeed,
  setChangeTime,
  changeTime,
  pathData,
  setPathData,
  setCurrentStep,
  fetchData,
  xPos = 0.0,
  yPos = 0.0,
  displayCalendar = false,
  setDisplayCalendar,
  isPlaying,
  setIsPlaying,
  cameraList = [],
  currentStep,
}) => {
  const increment = 5;
  const numberOfTicks = 13;

  const calendarDropdownRef = useRef(null);
  const handlePrevious = () => {
    setPathData([]);
    setCurrentStep(0);
    setChangeTime(true);
    setMinutes((prev) => {
      if (prev - increment < 0) {
        setHours((h) => Math.max(h - 1, 0));
        return 60 - increment;
      }

      return prev - increment;
    });
    const updateDate = dayjs(chosenDate);
    setChosenDate(
      updateDate.minute() - increment < 0
        ? updateDate
            .set("hour", updateDate.hour() - 1)
            .set("minute", 60 - increment)
        : updateDate.set("minute", updateDate.minute() - increment)
    );
  };

  const handleNext = () => {
    setPathData([]);
    setCurrentStep(0);
    setChangeTime(true);
    setMinutes((prev) => {
      if (prev + increment >= 60) {
        setHours((h) => h + 1);
        return 0;
      }
      return prev + increment;
    });
    const updateDate = dayjs(chosenDate);
    setChosenDate(
      updateDate.minute() + increment >= 60
        ? updateDate.set("hour", updateDate.hour() + 1).set("minute", 0)
        : updateDate.set("minute", updateDate.minute() + increment)
    );
  };

  const generateTimes = (startHours, startMinutes) => {
    let times = [];
    let currentHours = startHours;
    let currentMinutes = startMinutes;

    for (let i = 0; i < numberOfTicks; i++) {
      times.push(
        `${currentHours}:${currentMinutes < 10 ? "0" : ""}${currentMinutes}`
      );
      currentMinutes += increment;
      if (currentMinutes >= 60) {
        currentMinutes -= 60;
        currentHours += 1;
      }
    }
    return times;
  };

  const times = generateTimes(hours, minutes);

  const handleClickTime = (time, j) => {
    // Parse the selectDate string using dayjs
    setPathData([]);
    setCurrentStep(0);
    setChangeTime(true);
    const formattedTime = dayjs(selectedDate)
      .set("hour", parseInt(time.split(":")[0]))
      .set("minute", parseInt(time.split(":")[1]) + (j + 1));

    setChosenDate(formattedTime);
  };
  const updateMarker = () => {
    !!isPlaying &&
      setChosenDate((prev) => {
        const updateDate = dayjs(prev);
        if (updateDate.second() + speed >= 60) {
          const increaseSecond = updateDate
            .set("minute", updateDate.minute() + 1)
            .set("second", 0);
          if (increaseSecond.minute() >= 60) {
            return increaseSecond
              .set("hour", updateDate.hour() + 1)
              .set("minute", 0);
          }
          return increaseSecond;
        }

        return updateDate.set("second", updateDate.second() + speed);
      });
  };
  useEffect(() => {
    if (!!pathData.length) {
      updateMarker();
      const intervalId = setInterval(updateMarker, 1000 / parseInt(speed));

      return () => clearInterval(intervalId);
    }
  }, [isPlaying, speed]);
  useEffect(() => {}, [pathData]);
  const handleLive = () => {
    setChangeTime(true);
    setChosenDate(new Date("15-8-2024"));
    setSelectedDate(new Date("15-8-2024"));
    setHours(new Date("15-8-2024").getHours());
    setMinutes(new Date("15-8-2024").getMinutes());
  };
  const handleApplyCalendar = () => {
    //

    setDisplayCalendar(!displayCalendar);
    const selectedHours = new Date(selectedDate).getHours();
    const selectedMinutes = new Date(selectedDate).getMinutes();
    setChangeTime(true);
    setHours(selectedHours);
    setMinutes(selectedMinutes);
    const updateDate = dayjs(selectedDate);
    setChosenDate(
      updateDate.set("hour", selectedHours).set("minute", selectedMinutes)
    );
  };
  const handleReset = () => {
    setDisplayCalendar(!displayCalendar);
  };

  return (
    <div className="flex flex-col gap-2  px-4 bg-[#F8F8E8]">
      <div className="flex justify-between">
        <div className="flex">
          <div class={styles.dateBtn} ref={calendarDropdownRef}>
            <div onClick={() => setDisplayCalendar(!displayCalendar)}>
              {" "}
              {/* <MdOutlineCalendarToday size={20} /> */}
              <label>{dayjs(chosenDate).format("YYYY.MM.DD h:mm:ss A")} </label>
            </div>

            {displayCalendar && (
              <div class={styles.calendarBox}>
                <CustomPicker
                  startDate={selectedDate}
                  setStartDate={setSelectedDate}
                />
                <div
                  class={styles.calendarBoxAction}
                  onClick={() => {
                    setDisplayCalendar(false);
                  }}
                >
                  <button
                    class={styles.calendarBoxResetAction}
                    // className="cancelBtn"
                    onClick={() => {
                      handleReset();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    class={styles.calendarBoxApplyAction}
                    onClick={() => {
                      handleApplyCalendar();
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center ">
          <button onClick={handlePrevious} className="px-2 py-1">
            <MdOutlineKeyboardDoubleArrowLeft color="#7E6E3C" size={25} />
          </button>
          <button
            className="px-2 py-1"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <MdPause color="#7E6E3C" size={23} />
            ) : (
              <MdArrowRight color="#7E6E3C" size={40} />
            )}
          </button>
          <span className="mx-2 text-[#2F2F2F] text-[13px]">
            {/* {isPlaying ? "Replaying" : "Replay"} */}
            {!pathData.length
              ? "Robot is not running"
              : pathData?.length > 2 && currentStep == 0 && !isPlaying
              ? "Replay"
              : pathData?.length > 2 && currentStep >= 0 && isPlaying
              ? "Replaying"
              : "Resume"}
          </span>
          <button onClick={handleNext} className="px-2 py-1">
            <MdKeyboardDoubleArrowRight color="#7E6E3C" size={25} />
          </button>
          <div class="select-container">
            <select id="speed-select" value={speed} onChange={handleSpeed}>
              {Array.from({ length: 5 }, (_, j) => (
                <option key={j} value={j + 1}>
                  {j + 1}x
                </option>
              ))}
            </select>
          </div>
          <div className="text-[red] pl-2">
            {!pathData.length
              ? "Robot is not running"
              : pathData?.length == 0
              ? "Robot is not ready!!!"
              : pathData?.length > 2 && currentStep == 0 && !isPlaying
              ? "Ready to replay!!!  "
              : ""}
          </div>
        </div>
        <div className="w-[200px]">{`x: ${Math.round(xPos * 1000) / 1000}, y: ${
          Math.round(yPos * 1000) / 1000
        }`}</div>
        {/* <div className="w-[200px]">{`x: -123.566, y: -526.896`}</div> */}
      </div>
      <div className="flex justify-center overflow-x-auto space-x-2 bg-[#D9D9D9] rounded-[6px] border-none p-2 text-[#344054] text-[12px]">
        {times.map((time, i) => (
          <div key={i} className="flex items-center space-x-3 text-center">
            <span
              class={`${
                dayjs(selectedDate)
                  .set("hour", parseInt(time.split(":")[0]))
                  .set("minute", parseInt(time.split(":")[1]))
                  .isSame(dayjs(chosenDate), "minute")
                  ? // // .set("second", j * 6)
                    // .valueOf() == dayjs(chosenDate).valueOf()
                    styles.currentTimeLabel
                  : styles.dotLabel
              }`}
              onClick={() => {
                handleClickTime(time, -1);
              }}
            >
              {time}
            </span>
            {i < times.length - 1 &&
              Array.from({ length: 4 }, (_, j) => (
                <span
                  key={j}
                  class={`${
                    dayjs(selectedDate)
                      .set("hour", parseInt(time.split(":")[0]))
                      .set("minute", parseInt(time.split(":")[1]) + (j + 1))
                      .isSame(dayjs(chosenDate), "minute")
                      ? // .set("second", j * 6)
                        // .valueOf() == dayjs(chosenDate).valueOf()
                        styles.currentTime
                      : styles.dot
                  }`}
                  onClick={() => {
                    handleClickTime(time, j);
                  }}
                >
                  {/* • */}
                </span>
              ))}
          </div>
        ))}
      </div>
      <div className=" z-10 w-[100%]">
        <PlanCameraView cameras={cameraList} />
      </div>
    </div>
  );
};

export default PlanFooter;
