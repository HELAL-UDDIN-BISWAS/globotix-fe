import Image from "next/image";

import { FontHind } from "@/components/fonts";

const CardRobotModule = (props) => {
  const { item } = props;
  return (
    <>
      <div className="w-full rounded-[10px] bg-white ">
        <div className={`bg-primary h-2.5 rounded-t-[10px]`}></div>
        <div className={`cursor-pointer p-4 rounded-b-[10px] bg-white`}>
          <div className="flex justify-between items-center">
            <label className="text-black-1 font-semibold">
              {item?.module_id}
            </label>
          </div>
          <div
            className={`mt-2.5 grid grid-cols-1 md:grid-cols-1 text-xs font-light ${FontHind.className}`}
          >
            <div className="grid grid-cols-1">
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-start items-center">
                  <Image
                    src="/assets/icons/icon_location_blue.svg"
                    className="mr-2"
                    width={20}
                    height={20}
                    alt=""
                  />{" "}
                  <span className="mt-0.5">{item.location_name}</span>
                </div>
                <div className="flex justify-start items-center">
                  <Image
                    src="/assets/icons/icon_fuel_blue.svg"
                    className="mr-2"
                    width={20}
                    height={20}
                    alt=""
                  />{" "}
                  <span className="mt-0.5">{item.battery}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardRobotModule;
