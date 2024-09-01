import { Hind } from "next/font/google";
import { useState } from "react";
import { Controller } from "react-hook-form";

const CheckInput = ({
  color,
  name,
  label,
  value,
  control,
  placeholder,
  isRequired,
  isInvalid,
  register,
  index,
}) => {
  return (
    <>
      <div className="flex space-x-2.5 ">
        <input
          id={label + index}
          type="checkbox"
          className={"cursor-pointer rounded-2xl"}
          placeholder={placeholder}
          {...register(name, {
            required: isRequired ? true : false,
          })}
          value={value || label}
        />

        <label
          htmlFor={label + index}
          className={`text-xs cursor-pointer ${color ? color : "text-white"}`}
        >
          {label}
        </label>
      </div>
    </>
  );
};

export default CheckInput;
