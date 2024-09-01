"use client";
import Page from "@/components/layout/page";
import React, { useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import Calendar from "./calendar";
import useSchedule from "@/hooks/useSchedule";

const ScheduleView = () => {
  // const { getSchedules } = useSchedule();

  // useEffect(() => {
  //   getSchedules();
  // }, []);

  return (
    <Page title={"Schedule"}>
      <Calendar />
    </Page>
  );
};

export default ScheduleView;
