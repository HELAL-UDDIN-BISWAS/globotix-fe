import dayjs from "dayjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BotBaseActivityLog = ({ reportData = [], itemCount = 0 }) => {
  const params = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (reportData) {
      setData(reportData.slice(0, itemCount));
    }
  }, [reportData]);

  return (
    <div className="flex flex-col">
      {data?.map((item, index) => (
        <div
          key={index}
          className={`flex items-center px-4 gap-2 py-1 ${
            index % 2 === 0 ? "bg-[#F7F7F9]" : "bg-white"
          }`}
        >
          <span className="text-bodyTextColor text-[14px] font-normal font-inter">
            {item?.attributes?.cleaningStatus}
            {item?.attributes?.cleaningZonePercentage && (
              <span className="pl-4 text-[#0A8217]">
                {item?.attributes?.cleaningZonePercentage}%
              </span>
            )}
          </span>
          <span className="ml-auto text-right text-[#667085] text-[12px] font-normal">
            <span className="block">
              {dayjs(item?.attributes?.updatedAt).format("HH:mm")}
            </span>
            <span className="block">
              {dayjs(item?.attributes?.updatedAt).format("DD/MM/YY")}
            </span>
          </span>
        </div>
      ))}
      <div className="grid grid-cols-1 sm:grid-cols-5  bg-[#F7F7F9]"></div>
    </div>
  );
};

export default BotBaseActivityLog;
