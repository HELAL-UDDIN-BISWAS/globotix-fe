import { useState } from "react";
import BatteryIcon from "/public/upload/icons/icon_battery_gray.svg";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import InfoDisplay from "./InfoDisplay";
const RobotDetailModal = (props) => {
  const handleClose = () => {
    if (props.loading) return;
    props.onClose();
  };

  return (
    <>
      {props.open && (
        <div
          onClick={() => handleClose()}
          className="bg-black/75 fixed w-full h-screen top-0 left-0 z-[997] opacity-40 transition-all"
        ></div>
      )}
      <div
        className={`transition-all duration-500 fixed z-[998] ${
          props.open ? "bottom-1/2 translate-y-1/2" : "-bottom-[1000px]"
        } left-1/2 -translate-x-1/2 py-[30px] px-[15px] rounded-[20px] min-w-[600px]  bg-white text-black-1`}
      >
        <div className="font-bold text-xl text-center">
          <div
            onClick={() => handleClose()}
            className="flex items-end justify-end cursor-pointer"
          >
            <RxCross1 />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Image src={BatteryIcon} width={35} height={35} alt="" />
            <p className="text-lg text-bodyTextColor font-semibold">Battery</p>
            <p className="text-yellow text-[26px] font-semibold">
              {props?.viewItem?.battery}%
            </p>
            <div className="mt-4">
              <p className="text-lg font-semibold text-bodyTextColor">
                General Information
              </p>

              <div className="h-[300px] mt-3 px-12 overflow-y-auto scrollable-container">
                <InfoDisplay
                  caption="Display Name"
                  value={props?.viewItem?.displayName || "-"}
                />
                <InfoDisplay
                  caption="Serial Number"
                  value={props?.viewItem?.serialNumber || "-"}
                />
                <InfoDisplay
                  caption="Building"
                  value={props?.viewItem?.building || "-"}
                />
                <InfoDisplay
                  caption="Location(Map)"
                  value={props?.viewItem?.location || "-"}
                />
                <InfoDisplay
                  caption="Cleaning Plan"
                  value={props?.viewItem?.cleaningPlan || "-"}
                />
                {/* <InfoDisplay
                  caption="Wireguard IP"
                  value={props?.viewItem?.wireguardIp || "-"}
                /> */}
                <InfoDisplay
                  caption="Firmware Version"
                  value={props?.viewItem?.firmwareVersion || "-"}
                />
                <InfoDisplay
                  caption="License"
                  value={props?.viewItem?.license || "-"}
                />
                <InfoDisplay
                  caption="Working Status"
                  value={props?.viewItem?.workingStatus || "-"}
                />
                {/* <InfoDisplay
                  caption="Status Level"
                  value={props?.viewItem?.statusLevel || "-"}
                />
                <InfoDisplay
                  caption="Gutter Brush Usage"
                  value={props?.viewItem?.gutterBrushUsage || "-"}
                />
                <InfoDisplay
                  caption="Charging Time"
                  value={props?.viewItem?.chargingTime || "-"}
                />
                <InfoDisplay
                  caption="Deployed Time"
                  value={props?.viewItem?.deployedTime || "-"}
                />
                <InfoDisplay
                  caption="Robot Status"
                  value={props?.viewItem?.status || "-"}
                />
                {props?.viewItem?.status == "cleaning" && (
                  <InfoDisplay
                    caption="Zone Position"
                    value={props?.viewItem?.zonePosition || "-"}
                  />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RobotDetailModal;
