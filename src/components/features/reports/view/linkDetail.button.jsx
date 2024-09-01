import { useState } from "react";
import Link from "next/link";

import IconReports from "@/components/icons/iconReports";

const ButtonLinkDetail = (props) => {
  const [hover, setHover] = useState(false);
  return (
    <>
      {props.url ? (
        <Link
          href={props.url}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="relative p-1.5 rounded-[5px] hover:bg-disable text-primary w-[30px] h-[30px] flex justify-center items-center "
        >
          <IconReports />{" "}
          <div
            className={`${
              hover ? "inline-block" : "hidden"
            } absolute w-max h-max left-1/2 -translate-x-1/2 -bottom-10  py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}
          >
            View Report
          </div>
        </Link>
      ) : (
        <div
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="relative p-1.5 rounded-[5px] hover:bg-disable text-primary w-[30px] h-[30px] flex justify-center items-center "
        >
          <IconReports />{" "}
          <div
            className={`${
              hover ? "inline-block" : "hidden"
            } absolute w-max h-max left-1/2 -translate-x-1/2 -bottom-10  py-[7px] px-2.5 bg-primary text-xs text-white rounded-[10px]`}
          >
            View Report
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonLinkDetail;
