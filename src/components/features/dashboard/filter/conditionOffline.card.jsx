import { useState } from "react";

const CardOfflineCondition = (props) => {
  const [hover, setHover] = useState(false);

  return (
    <>
      <div
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => props.onClick(props.label)}
        className={`${
          props.active || hover
            ? "bg-primary border border-primary text-white"
            : "bg-gray border border-gray text-white"
        }  max-w-[125px] min-w-[125px] h-[30px] cursor-pointer p-4 flex rounded-[8px] space-x-4 text-[14px] font-semibold  justify-center items-center`}
      >
        <label className="w-full cursor-pointer capitalize">
          {props.label}
        </label>
        <label className=" cursor-pointer ">{props.total}</label>
      </div>
    </>
  );
};

export default CardOfflineCondition;
