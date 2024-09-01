import { useState } from "react";
import Image from "next/image";

import dropdownIcon from "/public/upload/icons/icon_chevron_down.svg";
const CardExpandable = (props) => {
  const [expand, setExpand] = useState(props.expand ? props.expand : false);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`w-full border-1 border-gray  rounded-[10px] border
       bg-white
      `}
    >
      {/* FILTER DURATION */}
      <div
        onClick={(e) => setExpand(!expand)}
        className={`cursor-pointer flex justify-between items-center p-4 
           bg-primary02
        } rounded-t-[10px]  ${!expand ? "rounded-b-[10px]" : "border-b-0"}`}
      >
        <label className="text-black-1 text-sm cursor-pointer">
          {props.title}
        </label>
        <div className="flex space-x-5">
          {props.value !== "" && (
            <button
              onClick={() => props?.onClear()}
              type="button"
              className={`w-max font-semibold flex items-center justify-center px-0 rounded-[10px]  `}
            >
              <div className="flex space-x-2 w-max justify-center items-center text-red-1">
                Clear
              </div>
            </button>
          )}

          <Image
            className={`transition-all ${expand ? "rotate-180" : "rotate-0"}`}
            src={dropdownIcon}
            width={10}
            height={5}
            alt=""
          />
        </div>
      </div>
      <div
        className={`${expand ? "block" : "hidden"} 
        } rounded-[10px] p-4 bg-white`}
      >
        {props?.children}
      </div>
      <div
        className={`${expand ? "hidden" : "block"} 
        } rounded-[10px] px-4 py-3 bg-white text-black-1 text-xs capitalize`}
      >
        {props.infoMsg}
      </div>
    </div>
  );
};

export default CardExpandable;
