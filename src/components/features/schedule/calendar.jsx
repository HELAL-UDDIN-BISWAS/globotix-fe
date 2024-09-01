// components/Calendar.js

import { useCallback, useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parse,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
  getDay,
} from "date-fns";
import styles from "./calendar.module.css";
import SecondaryButton from "@/components/button/SecondaryButton";
import ButtonLeftRight from "@/components/common/buttonLeftRight";
import Link from "next/link";
import Button from "@/components/common/button";
import ScheduleList from "./scheduleList";
import { BsDot } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import useSchedule from "@/hooks/useSchedule";
import apolloClient from "@/lib/apolloClient";
import { GET_SCHEDULES } from "@/graphql/queries/schedule";
import dayjs from "dayjs";
import {
  convertTo12HourFormat,
  getEndOfDay,
  getStartOfDay,
} from "@/utils/helper";

import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
import FilterButton from "./FilterButton";
import { BiReset } from "react-icons/bi";
import useAuth from "@/hooks/useAuth";
import { isArray } from "lodash";
const socket = io(API_URL, { transport: ["websocket"] });

const isDateSelected = (date, selectedList) => {
  const included = selectedList.find((item) => isSameDay(date, item));
  if (included) {
    return true;
  } else {
    return false;
  }
};

const Calendar = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState([new Date()]);
  const [schedules, setSchedules] = useState([]);
  const { getSchedulesBySelectedDates } = useSchedule();
  const [filters, setFilters] = useState();
  const [isReseted, setIsReseted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [submitFilter, setSubmitFilter] = useState(null);

  const fetchSchedulesByMonth = useCallback(async (filterData) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD") || "";
    const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD") || "";
    let filters = { and: [] };

    if (user?.role === "admin") {
      filters.and = _.concat(filters.and, {
        cleaningPlanEditor: {
          location: {
            robots: {
              building: {
                organization: { id: { eq: user?.organization?.id } },
              },
            },
          },
        },
      });
    } else if (user?.role === "user") {
      filters.and = _.concat(filters.and, {
        cleaningPlanEditor: {
          location: {
            robots: {
              building: { id: { in: user?.buildings?.map((e) => e.id) } },
            },
          },
        },
      });
    }

    if (!filterData) {
      filters.and = _.concat(filters.and, [
        {
          or: [
            {
              and: [
                { frequency: { in: ["Once"] } },
                { cleaningDate: { gte: formattedStartDate } },
                { cleaningDate: { lte: formattedEndDate } },
              ],
            },
            {
              and: [
                { frequency: { notIn: ["Once"] } },
                { cleaningDate: { lte: formattedStartDate } },
                { repeatUntil: { lte: formattedEndDate } },
              ],
            },
            {
              and: [
                { frequency: { notIn: ["Once"] } },
                { cleaningDate: { gte: formattedStartDate } },
                { repeatUntil: { lte: formattedEndDate } },
              ],
            },
            {
              and: [
                { frequency: { notIn: ["Once"] } },
                { cleaningDate: { gte: formattedStartDate } },
                { repeatUntil: { gte: formattedEndDate } },
              ],
            },
          ],
        },
      ]);
    }

    if (filterData?.building && filterData?.building?.length > 0) {
      filters.and = _.concat(filters.and, {
        cleaningPlanEditor: {
          building: {
            id: {
              in: filterData?.building?.map((data) => data),
            },
          },
        },
      });
    }
    if (filterData?.organization && filterData?.organization?.length > 0) {
      filters.and = _.concat(filters.and, {
        cleaningPlanEditor: {
          building: {
            organization: {
              id: {
                in: filterData?.organization?.map((data) => data),
              },
            },
          },
        },
      });
    }
    if (filterData?.robotData && filterData?.robotData?.length > 0) {
      filters.and = _.concat(filters.and, {
        cleaningPlanEditor: {
          robots: {
            id: {
              in: filterData?.robotData?.map((data) => data),
            },
          },
        },
      });
    }

    try {
      const response = await apolloClient.query({
        query: GET_SCHEDULES,
        fetchPolicy: "network-only",
        variables: {
          filters: filters,
        },
      });
      // console.log("res", response);

      if (response?.data?.schedules?.data) {
        setSchedules(response?.data?.schedules?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  const fetchSchedulesByDate = async () => {
    getSchedulesBySelectedDates({
      selectedDates: selectedDate || [],
      filterData: { ...submitFilter, user: user },
    });
  };

  socket.on("robot-flexadev-queue", (arg) => {
    if (arg.table_name === "schedule") {
      fetchSchedulesByDate();
      fetchSchedulesByMonth(submitFilter);
    }
  });

  useEffect(() => {
    fetchSchedulesByDate();
  }, [selectedDate]);

  useEffect(() => {
    fetchSchedulesByDate();
    fetchSchedulesByMonth(submitFilter);
  }, [submitFilter, fetchSchedulesByMonth, currentMonth]);

  const handleFilter = (val) => {
    setFilters({ ...filters, ...val });
  };

  const toggleFilterModal = () => {
    setFilters([]);
    setOpenModal((prev) => !prev);
    if (!openModal) setIsReseted(false);
  };

  const applyFilter = () => {
    setIsReseted(false);
    setSubmitFilter(filters);
    toggleFilterModal();
  };

  const resetFilter = () => {
    setIsReseted(!isReseted);
    setSelectedDate([new Date()]);
    setSubmitFilter(null);
    fetchSchedulesByMonth();
    toggleFilterModal();
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="flex items-center gap-[16px]">
        <SecondaryButton
          onClick={() => {
            setSelectedDate([new Date()]);
            setCurrentMonth(new Date());
          }}
        >
          Today
        </SecondaryButton>
        <ButtonLeftRight onPrevClick={prevMonth} onNextClick={nextMonth}>
          <span>{format(currentMonth, dateFormat)}</span>
        </ButtonLeftRight>
        {/* <div className="z-50" onClick={() => setOpenModal(!openModal)}> */}
        <FilterButton
          handleFilter={handleFilter}
          applyFilter={applyFilter}
          resetFilter={resetFilter}
          filter={submitFilter}
          isReseted={isReseted}
          openModal={openModal}
          toggle={toggleFilterModal}
        />
        {/* </div> */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => resetFilter()}
        >
          <span className="text-hyperLinkColor border border-t-0 border-l-0 border-r-0 border-b-hyperLinkColor">
            Reset
          </span>
          <BiReset fill="#599CFF" />
        </div>
        <Link href="/schedule/add" className="ml-auto">
          <Button>
            <AiOutlinePlus size={16} color="white" />
            <span className="text-white">Add Schedule</span>
          </Button>
        </Link>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEE";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className={`flex-1 text-center py-[14px] ${
            i == 0 ? "border-none" : "border-l-[1px]"
          } border-gray`}
          key={i}
        >
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return (
      <div className="flex bg-white border-b-[1px] border-gray rounded-t-lg">
        {days}
      </div>
    );
  };

  const isDateInRange = (date, startDate, endDate) => {
    const parsedDate = new Date(date);
    const parsedStartDate = getStartOfDay(new Date(startDate));
    const parsedEndDate = getEndOfDay(new Date(endDate));

    return isWithinInterval(parsedDate, {
      start: parsedStartDate,
      end: parsedEndDate,
    });
  };

  const isWeekDayInclude = (date, weekDays) => {
    let isInclude = [];
    const currentWeekDay = getDay(date);
    if (isArray(weekDays)) {
      isInclude = weekDays?.find((weekDay) => weekDay == currentWeekDay);
    }
    if (typeof weekDays === "string") {
      const parsedWeekDays = JSON.parse(weekDays);
      isInclude = parsedWeekDays?.find((weekDay) => weekDay == currentWeekDay);
    }
    return isInclude ? true : false;
  };

  const renderScheduleBadge = (day) => {
    const onceTimeSchedules = schedules?.filter(
      (e) =>
        e?.attributes?.frequency === "Once" &&
        isSameDay(e?.attributes?.cleaningDate, day)
    );
    const dailySchedules = schedules?.filter(
      (e) =>
        e?.attributes?.frequency === "Daily" &&
        isDateInRange(
          day,
          e?.attributes?.cleaningDate,
          e?.attributes?.repeatUntil
        )
    );
    const weeklySchedules = schedules?.filter(
      (e) =>
        e?.attributes?.frequency === "Weekly" &&
        isWeekDayInclude(day, e?.attributes?.daysOfWeek) &&
        isDateInRange(
          day,
          e?.attributes?.cleaningDate,
          e?.attributes?.repeatUntil
        )
    );

    const allScheduleList = onceTimeSchedules.concat(
      dailySchedules,
      weeklySchedules
    );

    if (allScheduleList) {
      const badges = [];
      const iterations =
        allScheduleList.length > 4 ? 4 : allScheduleList.length;
      for (let i = 0; i < iterations; i++) {
        if (allScheduleList.length > iterations && i === iterations - 1) {
          badges.push(
            <div className="flex gap-[3px]">
              <div className="flex-1 py-[2px] px-[3px] bg-hover text-primary flex gap-[2px] items-center">
                <BsDot />
                <span>
                  {convertTo12HourFormat(
                    allScheduleList[i]?.attributes.cleaningTime
                  ) || ""}
                </span>
              </div>
              <div className="py-[2px] px-[3px] bg-hover text-primary">
                <span>+ {allScheduleList.length - 4}</span>
              </div>
            </div>
          );
        } else {
          badges.push(
            <div className="py-[2px] px-[3px] bg-hover text-primary flex gap-[2px] items-center">
              <BsDot />
              <span>
                {convertTo12HourFormat(
                  allScheduleList[i]?.attributes.cleaningTime
                ) || ""}
              </span>
            </div>
          );
        }
      }

      return badges;
    }
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      const remainingDays = 7; // Since we process 7 days per while iteration
      const isLastLoop = addDays(day, remainingDays) > endDate;
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`flex-1 min-h-[180px] p-[2px] border-gray ${
              i == 0 ? "border-none" : "border-l-[1px]"
            }`}
          >
            <div
              className={`h-full w-full px-[3px] py-[4px] text-center cursor-pointer flex flex-col gap-[5px] items-center ${
                !isSameMonth(day, monthStart)
                  ? "text-gray"
                  : "text-bodyTextColor"
              }
              ${
                isDateSelected(day, selectedDate) ? "bg-primary text-white" : ""
              }
              `}
              key={day}
              onClick={() => onDateClick(cloneDay)}
            >
              {isSameDay(day, new Date()) ? (
                <span className="flex items-center justify-center rounded-full bg-primary text-white h-7 w-7">
                  {formattedDate}
                </span>
              ) : (
                <span>{formattedDate}</span>
              )}
              <div className="flex flex-col gap-[3px] w-full mt-auto">
                {renderScheduleBadge(day)}
              </div>
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          className={`flex border-gray ${
            isLastLoop ? "border-none" : "border-b-[1px]"
          }`}
          key={day}
        >
          {days}
        </div>
      );
      days = [];
    }
    return <div className="rounded-b-lg">{rows}</div>;
  };

  const onDateClick = (day) => {
    if (isDateSelected(day, selectedDate)) {
      const listNotEqual = selectedDate.filter((item) => !isSameDay(item, day));
      setSelectedDate(listNotEqual);
    } else {
      setSelectedDate((prev) => [...prev, day]);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className="flex flex-col gap-[27px] px-[20px] text-bodyTextColor">
      {renderHeader()}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 w-full">
        <div className="lg:col-span-3 grow bg-white border-gray rounded-lg border-[1px] shadow-table-shadow">
          {renderDays()}
          {renderCells()}
        </div>
        <div className="lg:col-span-1">
          <ScheduleList
            fetchSchedulesByDate={fetchSchedulesByDate}
            fetchSchedulesByMonth={fetchSchedulesByMonth}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
