"use client";
import Image from "next/image";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ButtonDownloadPDFLocation = (props) => {
  const [hover, setHover] = useState(false);

  const download = () => {
    html2canvas(document.querySelector("#divReportDetail")).then((canvas) => {
      document.body.appendChild(canvas); // if you want see your screenshot in body.
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("l", "pt", "a4", false);
      pdf.addImage(imgData, "PNG", 0, 0, 900, 0, undefined, false);
      pdf.save(
        `report_${props.dataDetail?.robot_id}_${Number(new Date())}.pdf`
      );
      canvas.remove();
    });
  };
  return (
    <div className="relative w-10 h-10 flex justify-center items-center">
      <Image
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {}}
        src="/assets/icons/icon_download.svg"
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
        Download Location
      </div>
    </div>
  );
};

export default ButtonDownloadPDFLocation;
