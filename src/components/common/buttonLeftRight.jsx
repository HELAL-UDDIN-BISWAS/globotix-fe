import React from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const ButtonLeftRight = (props) => {
  const attr = { ...props };
  delete attr["loading"];
  return (
    <div
      className={`w-max min-w-[100px] text-primary flex items-center justify-center py-4 px-5 h-[${
        props.height ? props.height : "45"
      }px]  rounded-[10px]  bg-primary02 border border-primary gap-5
     `}
      {...attr}
    >
      <SlArrowLeft className="cursor-pointer" onClick={props.onPrevClick} />
      <span className="font-semibold">{props.children}</span>
      <SlArrowRight className="cursor-pointer" onClick={props.onNextClick} />
    </div>
  );
};

export default ButtonLeftRight;
