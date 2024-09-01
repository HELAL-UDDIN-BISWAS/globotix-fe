import { useState } from "react";
import Image from "next/image";

const ButtonCamera = (props) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`${
        hover ? "bg-disable" : ""
      } rounded-[5px] relative w-[30px] h-[30px] flex justify-center items-center`}
    >
      <Image
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => alert(props.toolTip)}
        src="/assets/icons/icon_camera_blue.svg"
        className="cursor-pointer"
        width={15}
        height={13}
        alt=""
      />
      <div
        className={`${
          hover ? "inline-block" : "hidden"
        } absolute w-max h-max left-1/2 -translate-x-1/2 -bottom-8  py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}
      >
        {props.toolTip}
      </div>
    </div>
  );
};

export default ButtonCamera;
