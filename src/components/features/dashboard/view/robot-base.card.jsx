import Image from "next/image";
import IconEyeDetail from "@/components/icons/iconEyeDetail";
import LocationIcon from "/public/upload/icons/icon_location_blue.svg";
import BatteryIcon from "/public/upload/icons/icon_battery_blue.svg";
import RobotDetailModal from "./RobotDetailModal";
import { useState } from "react";
const CardRobotBase = (props) => {
  const { item } = props;
  const [viewItem, setViewItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const getBaseName = (val) => {
    let rbt = props?.robots.find((item) => val === item.base_name);

    return rbt?.display_name || "";
  };

  const handleViewDetail = (item) => {
    setViewItem(item);
    setOpenModal(!openModal);
  };

  return (
    <>
      <RobotDetailModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        viewItem={viewItem}
      />
      <div className="w-full rounded-[10px] bg-white ">
        <div className={`bg-primary h-2.5 rounded-t-[10px]`}></div>
        <div
          className={`cursor-pointer p-4 rounded-b-[10px] bg-white hover:bg-gradient-to-b hover:from-[#EAECEE] hover:to-white`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 w-full whitespace-nowrap">
              <div className="text-black-1 font-semibold">
                {/* {getBaseName(item?.base_id)} */}
                {item?.displayName}
              </div>
              <div
                className={`text-[14px] flex items-center gap-1 text-white font-medium bg-gray rounded-[8px] py-1 px-2`}
              >
                <div className="w-2 h-2 rounded-full bg-white"></div>{" "}
                {item?.status}
              </div>
            </div>
            <div className="mt-4 md:mt-0 w-full flex space-x-4 justify-end items-start">
              {/* <ButtonIcon
                url={`/robots/base/${item?.id}`}
                icon={<IconEyeDetail />}
                label="View Detail"
              /> */}
              <div onClick={() => handleViewDetail(item)}>
                <IconEyeDetail />
              </div>
              {/*<ButtonCamera toolTip="Camera" />*/}
              {/* <ButtonDirect toolTip="Link" /> */}
            </div>
          </div>
          <div
            className={`mt-2.5 grid grid-cols-1 md:grid-cols-2 text-xs font-light`}
          >
            <div className="grid grid-cols-1">
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-start items-center">
                  <Image
                    src={LocationIcon}
                    className="mr-2"
                    width={20}
                    height={20}
                    alt=""
                  />{" "}
                  <span className="mt-0.5">{item?.location}</span>
                </div>
                <div className="flex justify-start items-center">
                  <Image
                    src={BatteryIcon}
                    className="mr-2"
                    width={20}
                    height={20}
                    alt=""
                  />{" "}
                  <span className="mt-0.5">{item?.battery}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardRobotBase;
