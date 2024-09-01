import { forwardRef, useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuCalendarDays } from "react-icons/lu";
import SecondaryButton from "@/components/button/SecondaryButton";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const FilterDuration = (props) => {
  const [expand, setExpand] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (!props?.expand) {
      handleSetExpand(true);
    }
  }, [props?.expand]);

  const handleSetExpand = (val) => {
    setExpand(val);
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <SecondaryButton onClick={onClick} style={{ minWidth: "270px" }}>
        {value ? (
          <span>{value}</span>
        ) : (
          <>
            <span>From Date </span>
            <LuCalendarDays size={20} />
            <span> - To Date</span>
            <LuCalendarDays size={20} />
          </>
        )}
      </SecondaryButton>
    );
  });
  CustomInput.displayName = "CustomInput";
  return (
    <Controller
      name="date_range"
      defaultValue={[]}
      control={control}
      render={({ field: { onChange, name, value } }) => {
        const [startDate, endDate] = value;
        return (
          <DatePicker
            onChange={onChange}
            showYearDropdown
            dateFormatCalendar="MMMM"
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            dateFormat="dd MMM yy"
            showPopperArrow={false}
            portalId="root"
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            customInput={<CustomInput />}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div>
                <div className="text-right px-2">
                  <button
                    onClick={() => onChange([])}
                    className="ml-2  py-1 px-2 rounded focus:outline-none"
                  >
                    <span className="text-red font-bold text-base">Clear</span>
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 px-2 py-2">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <SlArrowLeft />
                  </button>
                  <div className="flex space-x-2 items-center">
                    <select
                      value={date.getFullYear()}
                      onChange={({ target: { value } }) => changeYear(value)}
                      className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                    >
                      {Array.from(
                        { length: 15 },
                        (_, i) => new Date().getFullYear() - i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <select
                      value={date.getMonth()}
                      onChange={({ target: { value } }) => changeMonth(value)}
                      className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) =>
                        new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })
                      ).map((month, index) => (
                        <option key={index} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <SlArrowRight />
                  </button>
                </div>
              </div>
            )}
          />
        );
      }}
    />
  );
};

export default FilterDuration;
