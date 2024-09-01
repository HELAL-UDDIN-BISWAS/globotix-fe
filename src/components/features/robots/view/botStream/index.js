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

const Home = ({
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
}) => {
  const increment = 5;
  const numberOfTicks = 15;

  const handlePrevious = () => {
    setPathData([]);
    setCurrentStep(0);
    setChangeTime(!changeTime);
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
    setChangeTime(!changeTime);
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

  const handleDateChange = (date) => {
    setPathData([]);
    setCurrentStep(0);
    setChangeTime(!changeTime);
    setSelectedDate(date);
    const selectedHours = date.getHours();
    const selectedMinutes = date.getMinutes();
    setHours(selectedHours);
    setMinutes(selectedMinutes);
    const updateDate = dayjs(date);
    setChosenDate(
      updateDate.set("hour", selectedHours).set("minute", selectedMinutes)
    );
  };
  useEffect(() => {
    // console.log(
    //   "chosenDate.in interval..",
    //   dayjs(chosenDate).format("MMM D YYYY h:mm:ss A")
    // );
    //  fetchData();
  }, [chosenDate]);
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
    setChangeTime(!changeTime);
    const formattedTime = dayjs(selectedDate)
      .set("hour", parseInt(time.split(":")[0]))
      .set("minute", parseInt(time.split(":")[1]) + (j + 1));

    setChosenDate(formattedTime);
  };
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
    const intervalId = setInterval(updateMarker, 1000);

    return () => clearInterval(intervalId);
    updateMarker();
  }, []);
  const handleLive = () => {
    setChangeTime(!changeTime);
    setChosenDate(new Date());
    setSelectedDate(new Date());
    setHours(new Date().getHours());
    setMinutes(new Date().getMinutes());
  };

  return (
    <div className="flex flex-col gap-4 pt-4 px-4 bg-[#F8F8E8]">
      <div className="flex justify-between">
        <div class={styles.CalendarBox}>
          <label>
            <MdOutlineCalendarToday size={20} />
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              dateFormat="yyyy.MM.dd HH:mm aa"
              className="border rounded p-2"
            />
          </label>
        </div>

        <div className="flex items-center mr-4">
          <button onClick={handlePrevious} className="px-2 py-1">
            <MdOutlineKeyboardDoubleArrowLeft color="#7E6E3C" size={25} />
          </button>
          <button className="px-2 py-1" onClick={handlePlay}>
            <MdArrowRight color="#7E6E3C" size={40} />
          </button>
          <span className="mx-2 text-[#2F2F2F] text-[13px]">Viewing Live</span>
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
        </div>
        <div
          className="flex gap-2 items-center py-0 px-6 rounded-[10px] text-[#23A450] text-[13px] bg-[#C6ECCE] h-10"
          onClick={handleLive}
        >
          Live <span className="w-3 h-3 bg-[#23A450] rounded-full"></span>
        </div>
      </div>
      <div className="flex overflow-x-auto space-x-2 bg-[#D9D9D9] rounded-[6px] border-none p-2 text-[#344054] text-[12px]">
        {times.map((time, i) => (
          <div key={i} className="flex items-center space-x-2 text-center">
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
    </div>
  );
};

export default Home;
