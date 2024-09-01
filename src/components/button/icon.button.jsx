import { useState } from "react";
import Link from "next/link";

const ButtonIcon = ({ isHover, url, icon, label, color, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <>
      {url ? (
        <Link
          href={url}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={` ${
            color ? color : "text-primary"
          } cursor-pointer relative p-1.5 rounded-[5px] hover:bg-disable  w-[30px] h-[30px] flex justify-center items-center`}
        >
          {icon}
          <div
            className={`${
              hover ? "inline-block" : "hidden"
            } absolute w-max h-max left-1/2 -translate-x-1/2 -bottom-10  py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}
          >
            {label}
          </div>
        </Link>
      ) : (
        <div
        data-testid={`button-icon-${label.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={() => onClick()}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`${color ? color : "text-primary"} ${
            isHover ? "bg-disable" : ""
          } cursor-pointer relative p-1.5 rounded-[5px] hover:bg-disable  w-[30px] h-[30px] flex justify-center items-center`}
        >
          {icon}
          {label && label !== "" && (
            <div
              className={`${
                hover ? "inline-block" : "hidden"
              } absolute w-max h-max left-1/2 -translate-x-1/2 -bottom-10  py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}
            >
              {label}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ButtonIcon;
