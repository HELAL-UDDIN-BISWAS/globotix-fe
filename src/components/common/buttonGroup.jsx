import React, { useEffect, useState } from "react";

const ButtonGroup = ({
  optionOne,
  optionTwo,
  optionThree,
  onChange,
  width,
}) => {
  const [option, setOption] = useState(optionOne);

  useEffect(() => {
    onChange(option);
  }, [option]);

  return (
    <button
      className={
        "flex box-border border-2 border-primary rounded-[10px] font-bold bg-white" +
        { width }
      }
    >
      <div
        className={`${
          option === optionOne
            ? "bg-primary text-white border-2 border-primary -m-[2px] relative z-10 rounded-[10px]"
            : "bg-white text-primary rounded-l-[10px]"
        } px-[20px] py-[10px] grow`}
        onClick={() => {
          setOption(optionOne);
        }}
      >
        {optionOne}
      </div>
      <div
        className={`${
          option === optionTwo
            ? "bg-primary text-white border-2 border-primary -m-[2px] relative z-10 rounded-[10px]"
            : "bg-white text-primary rounded-r-[10px]"
        } px-[20px] py-[10px] grow`}
        onClick={() => {
          setOption(optionTwo);
        }}
      >
        {optionTwo}
      </div>
      <div
        className={`${
          option === optionThree
            ? "bg-primary text-white border-2 border-primary -m-[2px] relative z-10 rounded-[10px]"
            : "bg-white text-primary rounded-r-[10px]"
        } px-[20px] py-[10px] grow`}
        onClick={() => {
          setOption(optionThree);
        }}
      >
        {optionThree}
      </div>
    </button>
  );
};

export default ButtonGroup;
