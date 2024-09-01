"use client";
import React, { useState, useEffect } from "react";
import styles from "./datepicker.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdArrowRight,
  MdOutlineCalendarToday,
} from "react-icons/md";
import Calendar from "@/components/features/schedule/calendar";
import dayjs from "dayjs";
import LiveCameraView from "./live-camera-four-images";

const LiveFooter = ({
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
  useEffect(() => {}, [chosenDate]);

  const updateMarker = () => {
    setChosenDate((prev) => {
      const updateDate = dayjs(prev);
      if (updateDate.second() + 1 >= 60) {
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

      return updateDate.set("second", updateDate.second() + 1);
    });
  };
  useEffect(() => {
    if (!!pathData.length) {
      updateMarker();
      const intervalId = setInterval(updateMarker, 1000 / parseInt(speed));

      return () => clearInterval(intervalId);
    }
  }, [isPlaying, speed, pathData]);
  useEffect(() => {}, [pathData]);

  return (
    <div className="flex flex-col  pt-4 px-4 bg-[#F8F8E8] fixed bottom-1 w-full">
      <div className="flex  items-center justify-between  text-center mr-[50px]">
        <div
          className="flex flex-row  gap-1 text-[#23A450] text-[13px] bg-[#C6ECCE] py-2 px-4 text-center items-center rounded-[10px]  "
          onClick={handlePlay}
        >
          {" "}
          Live <span className="w-3 h-3 bg-[#23A450] rounded-full "></span>
        </div>

        <div className="flex flex-col items-center ">
          <div>
            {dayjs(chosenDate).format("MMM D YYYY h:mm:ss A")}{" "}
            <div className="text-[red]">
              {!pathData.length || pathData?.length == 0
                ? "Robot is not running!!!"
                : "Playing"}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-[200px] mr-[20px]">{`x: ${
          Math.round(xPos * 1000) / 1000
        }, y: ${Math.round(yPos * 1000) / 1000}`}</div>
      </div>
      <div className="  z-10 w-[100%]">
        <LiveCameraView cameras={cameraList} />
      </div>
    </div>
  );
};

export default LiveFooter;
