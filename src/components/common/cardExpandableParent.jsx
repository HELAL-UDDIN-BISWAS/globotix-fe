import Image from "next/image";


const CardExpandableParent = (props) => {

  return (
    <div
      className={`w-full border-2 border-grey-1  rounded-[10px] ${
        props.expand ? "bg-white-1" : "bg-white-1"
      }`}
    >
      {/* FILTER DURATION */}
      <div
        onClick={() => props.setExpand(!props.expand)}
        className={`cursor-pointer flex justify-between items-center p-4 ${
          props.expand ? "bg-white-1" : "bg-white"
        } rounded-t-[10px]  ${!props.expand ? "rounded-b-[10px]" : "border-b-0"}`}
      >
        <label className="text-black-1 text-sm cursor-pointer">
          {props.title}
        </label>

        {
          (!props.isDisable || props.isDisable === null || props.isDisable === undefined) &&  <div className="flex space-x-5">
          <Image
            className={`transition-all ${props.expand ? "rotate-180" : "rotate-0"}`}
            src="/assets/icons/icon_chevron_down.svg"
            width={10}
            height={5}
            alt=""
          />
        </div>
        }
       
      </div>
      <div
        className={`${props.expand ? "block" : "hidden"} 
        } rounded-[10px] p-4 bg-white`}
      >
        {props?.children}
      </div>
      <div
        className={`${props.expand ? "hidden" : "block"} 
        } rounded-[10px] px-4 py-3 bg-white-1 text-black-1 text-xs`}
      >
        {props.infoMsg}
      </div>
    </div>
  );
};

export default CardExpandableParent;
