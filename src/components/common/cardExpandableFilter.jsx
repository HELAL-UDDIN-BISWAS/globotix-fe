import { useState } from "react";
import Image from "next/image";

const CardExpandableFilter = (props) => {
  const [expand, setExpand] = useState(props.expand ? props.expand : false);

  return (
    <div className={`w-full bg-white-1`}>
      <div
        className={`cursor-pointer flex justify-between items-center bg-white rounded-t-[10px] `}
      >
        <label className="text-black-1 text-sm cursor-pointer">
          {props.checkbox}
        </label>
        <Image
          onClick={() => setExpand(!expand)}
          className={`transition-all ${expand ? 'rotate-180' : 'rotate-0'}`}
          src="/assets/icons/icon_chevron_down.svg"
          width={10}
          height={5}
          alt=""
        />
      </div>
      <div
        className={`${expand ? "block" : "hidden"} 
        } py-1 bg-white`}
      >
        {props?.children}
      </div>
    </div>
  );
};

export default CardExpandableFilter;
