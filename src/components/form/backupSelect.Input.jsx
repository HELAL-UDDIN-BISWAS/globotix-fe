import { useState } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

import { FontHind } from "../fonts";

const selectStyles = {
  control: (styles) => ({
    ...styles,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    color: "#333333",
    backgroundColor: "white",
    borderColor: "#EAECEE",
    borderRadius: "10px",
    borderWidth: "2px",
    width: "100%",
    position: "relative",

    maxWidth: "100%",
    overflowX: "scroll",
    outline: "none",
    boxShadow: "none",
    "&:hover": {
      borderColor: "none",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),
  input: (styles) => ({
    ...styles,
    color: "#333333",
  }),

  // *menu container
  menu: (baseStyles, state) => ({
    ...baseStyles,
    zIndex: "1000",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "150px",
    "::-webkit-scrollbar": {
      width: "3px",
    },

    backgroundColor: "white",
    "::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      backgroundColor: "gray",
    },
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#F3F0E2",
    borderRadius: "12px",
    padding: "0px 5px",
    color: "#7E6E3C",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#7E6E3C",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#7E6E3C",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "null",
    },
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    color: "#333333",

    backgroundColor: !isDisabled ? (isSelected ? "#F3F0E2" : "white") : "white",
    "&:hover": {
      borderColor: "none",
      backgroundColor: "#F3F0E2",
    },
  }),
};

const selectErrorStyles = {
  control: (styles) => ({
    ...styles,
    height: "50px",
    borderColor: "#CB000F",
    boxShadow: "0 0 0 1px #cb000f",
  }),
};

const SelectInput = ({
  name,
  label,
  placeholder,
  isRequired,
  isInvalid,
  control,
  color,
  otherInfo,
  actionOtherInfo,
  options,
  disabled,
  isMulti,
  nomargin = false,
  getOptionLabel = (option) => option.name,
  getOptionValue = (option) => option.id,
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <>
      <div
        className={`${
          isInvalid ? "mb-10" : nomargin ? "mb-0" : "mb-5"
        } flex flex-col w-full ${FontHind.className}`}
      >
        {label && (
          <div className="flex justify-between">
            <label
              className={`text-xs ${
                color ? color : "text-black-1"
              } font-normal`}
            >
              {label}
            </label>

            {otherInfo && (
              <label
                onClick={() => actionOtherInfo()}
                className={`cursor-pointer text-xs text-[#0944A1] underline`}
              >
                {otherInfo}
              </label>
            )}
          </div>
        )}
        <div className="relative w-full">
          <div className="w-full relative group rounded-[10px]">
            <Controller
              name={name}
              control={control}
              rules={{ required: isRequired }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  styles={isInvalid ? selectErrorStyles : selectStyles}
                  placeholder={placeholder}
                  getOptionLabel={getOptionLabel}
                  getOptionValue={getOptionValue}
                  isDisabled={disabled}
                  isMulti={isMulti}
                />
              )}
            />
            {/* {focus && (
            <div className="absolute top-[3px]  w-full h-[45px] bg-primary rounded-[10px]"></div>
          )} */}
            <div className="absolute pointer-events-none inset-x-0 bottom-0 h-[3px] bg-transparent group-focus-within:bg-primary transition-colors duration-200 ease-out"></div>
          </div>
          {isInvalid && (
            <div className="text-white absolute text-[11px] px-[15px] py-[5px] flex items-end top-[29px] w-full h-[45px] bg-red-1 rounded-[10px]">
              {isInvalid.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectInput;
