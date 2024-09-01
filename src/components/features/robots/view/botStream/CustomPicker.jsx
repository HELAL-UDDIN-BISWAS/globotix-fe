"use client";
import { useState, memo } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { format } from "date-fns";
import DatePicker, { registerLocale } from "react-datepicker";
import en from "date-fns/locale/en-GB";
registerLocale("en", en);
import "react-datepicker/dist/react-datepicker.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./customPicker.module.css";
// import styled from 'styled-components'

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CustomPicker = ({ startDate, setStartDate }) => {
  const onChange = (dates) => {
    setStartDate(dates);
  };

  const CustomInput = ({ value, onClick }) => (
    <div
      class={styles.DatepickerContainer}
      className="react-datepicker__input-container"
      onClick={onClick}
      id="ScheduleUpdateTooltip"
    >
      <div class={styles.Icon}>
        <AiOutlineCalendar />
      </div>
      <label class={styles.Text}>
        {" "}
        {format(new Date(value), "yyyy.MM.dd")}{" "}
      </label>
    </div>
  );

  const CustomHeader = ({ date, decreaseMonth, increaseMonth }) => (
    <div
      style={{
        margin: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <button class={styles.DateNavBtn} onClick={decreaseMonth}>
        <div class={styles.NavigationIcon}>
          <FiChevronLeft />
        </div>
      </button>
      <div className="flex flex-row">
        <label class={styles.Text}> {months[date.getMonth()]} </label>
        <label class={styles.Text}> {date.getFullYear()} </label>
      </div>
      <button class={styles.DateNavBtn} onClick={increaseMonth}>
        <div class={styles.NavigationIcon}>
          <FiChevronRight />
        </div>
      </button>
    </div>
  );

  return (
    <div class={styles.DatepickerContainer}>
      <DatePicker
        locale="en"
        selected={startDate}
        customInput={<CustomInput />}
        renderCustomHeader={CustomHeader}
        onChange={onChange}
        wrapperClassName="react-datepicker"
        showTimeSelect
        inline
        startDate={startDate}
        maxDate={new Date()}
      />
    </div>
  );
};
export default memo(CustomPicker);
