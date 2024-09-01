import Image from "next/image";

import ButtonIcon from "@/components/button/icon.button";
import { FontHind } from "@/components/fonts";
import IconEyeDetail from "@/components/icons/iconEyeDetail";

const CardCriticalCondition = (props) => {
  const { item } = props;
  return (
    <>
      <div className="w-full rounded-[10px] bg-white ">
        <div className={`bg-red-1 h-2.5 rounded-t-[10px]`}></div>
        <div
          className={`cursor-pointer p-4 rounded-b-[10px] bg-white hover:bg-gradient-to-b hover:from-[#F7E6E6] hover:to-white`}
        >
          <div className="flex justify-between items-center">
            <label className="text-black-1 font-semibold">
              {item?.base_id}
              {/* | {item?.module_id}*/}
            </label>
            <label className={`text-black-1 font-medium ${FontHind.className}`}>
              {item?.status?.working_status}
            </label>
          </div>
          <div
            className={`mt-2.5 grid grid-cols-1 md:grid-cols-2 text-xs font-light ${FontHind.className}`}
          >
            <div className="grid grid-cols-2">
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-start items-center">
                  <Image
                    src="/assets/icons/icon_location_blue.svg"
                    className="mr-2"
                    width={20}
                    height={20}
                    alt=""
                  />{" "}
                  <span className="mt-0.5">{item?.location_name}</span>
                </div>
                <div className="flex justify-start items-center">
                  <Image
                    src="/assets/icons/icon_time_blue.svg"
                    className="mr-2"
                    width={20}
                    height={20}
                    alt=""
                  />{" "}
                  <span className="mt-0.5">{item?.cleaning_time}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-start items-center">
                  <Image
                    src="/assets/icons/icon_area_blue.svg"
                    className="mr-2"
                    width={20}
                    height={20}
                    alt=""
                  />{" "}
                  <span className="mt-0.5">{item?.location_name}</span>
                </div>
                <div className="flex justify-start items-center">
                  <Image
                    src="/assets/icons/icon_time_sand_blue.svg"
                    className="mr-2"
                    width={20}
                    height={20}
                    alt=""
                  />{" "}
                  <span className="mt-0.5">{item?.cleaning_time}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 w-full flex space-x-4 justify-end items-start">
              <ButtonIcon
                url={`/robots/base/${item?.id}`}
                icon={<IconEyeDetail />}
                label="View Detail"
              />
              {/*<ButtonCamera toolTip="Camera" />*/}
              {/* <ButtonDirect toolTip="Link" /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardCriticalCondition;
