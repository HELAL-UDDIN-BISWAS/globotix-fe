import { useState } from "react";

import { FontHind } from "../fonts";

const TimeInput = ({
  name,
  label,
  placeholder,
  isRequired,
  isInvalid,
  register,
  color,
  otherInfo,
  actionOtherInfo,
  disabled = false,
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <>
      <div
        className={`${isInvalid ? "mb-10" : "mb-5"} flex flex-col w-full ${
          FontHind.className
        }`}
      >
        {label && (
          <div className="flex justify-between">
            <label className={`text-xs ${color ? color : "text-black-1"}`}>
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
          <input
            disabled={disabled}
            type="time"
            onFocus={(e) => {
              setFocus(true);
              e.target.showPicker && e.target.showPicker();
            }}
            onBlurCapture={() => setFocus(false)}
            className={`${isInvalid ? "bg-red-2" : "bg-white"} ${
              disabled ? "bg-gray-200" : ""
            } relative z-10 w-full text-sm text-black-1 border-2 border-white-1 rounded-[10px] h-[45px] py-[12px] px-[15px] focus:outline-none`}
            placeholder={placeholder}
            {...register(name, {
              required: isRequired ? true : false,
            })}
          />
          {focus && (
            <div className="absolute top-[3px]  w-full h-[45px] bg-primary rounded-[10px]"></div>
          )}

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

export default TimeInput;
