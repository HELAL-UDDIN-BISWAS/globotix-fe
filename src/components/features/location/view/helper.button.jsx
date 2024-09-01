"use client";
import Image from "next/image";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ButtonHelper = (props) => {
  const [hover, setHover] = useState(false);

  return (
    <div className="relative w-10 h-10 flex justify-center items-center">
      <Image
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {}}
        src="/assets/icons/icon_help.svg"
        className="cursor-pointer"
        width={20}
        height={20}
        alt=""
      />
      <div
        className={`${
          hover ? "inline-block" : "hidden"
        } absolute w-max h-max left-1/2 -translate-x-1/2 -bottom-8  py-[7px] px-2.5 bg-blue-2 text-xs text-white rounded-[10px]`}
      >
        Help
      </div>
    </div>
  );
};

export default ButtonHelper;
