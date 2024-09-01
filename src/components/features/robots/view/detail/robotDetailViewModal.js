import { FontHind } from "@/components/fonts";
import { RangeColor } from "@/utils/helper";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { RxCross1 } from "react-icons/rx";
import BatteryIcon from "/public/upload/icons/icon_battery_gray.svg";
import Image from "next/image";
import InfoDisplay from "@/components/features/dashboard/view/InfoDisplay";

const RowDetail = (props) => {
  return (
    <div
      className={`w-full flex text-left text-base font-medium ${FontHind.className}`}
    >
      <div
        className={`flex text-secondaryFontColor ${
          props.width ? props.width : "min-w-40"
        }`}
      >
        <span>{props.title}</span>
        <span className="ml-auto mr-1">:</span>
      </div>
      {Array.isArray(props.info) ? (
        <div>
          {props.info
            ? props.info.map((item, index) => (
                <>
                  <span>{item}</span>
                  <br />
                </>
              ))
            : "-"}
        </div>
      ) : (
        <span>{props.info ? props.info : "-"}</span>
      )}
    </div>
  );
};

const RobotDetailViewModal = (props) => {
  const { user } = useAuth();
  const TAB = {
    BUILDING: "BUILDING",
    REPORT: "REPORT",
    BRUSH: "BRUSH",
  };
  const [tab, setTab] = useState(TAB.BUILDING);

  const handleClose = () => {
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
              {props?.bases?.attributes?.batteryPercentage}%
            </p>
            <div className="mt-4">
              <p className="text-lg font-semibold text-bodyTextColor">
                General Information
              </p>

              <div className="h-[300px] mt-3 px-12 overflow-y-auto scrollable-container">
                <InfoDisplay
                  caption="Display Name"
                  value={props?.bases?.attributes?.displayName || "-"}
                />
                <InfoDisplay
                  caption="Serial Number"
                  value={props?.bases?.attributes?.serialNumber || "-"}
                />
                <InfoDisplay
                  caption="Building"
                  value={
                    props?.bases?.attributes?.building?.data?.attributes.name ||
                    "-"
                  }
                />
                <InfoDisplay
                  caption="Location(Map)"
                  value={
                    props?.bases?.attributes?.locations?.data?.map(
                      (e) => e?.attributes?.name
                    ) || "-"
                  }
                />
                <InfoDisplay
                  caption="Cleaning Plan"
                  value={
                    props?.bases?.attributes?.cleaningPlanEditors?.data?.map(
                      (e) => e?.attributes?.name
                    ) || "-"
                  }
                />
                {/* <InfoDisplay
                  caption="Wireguard IP"
                  value={props?.bases?.attributes?.wireguardIp || "-"}
                /> */}
                <InfoDisplay
                  caption="Firmware Version"
                  value={props?.bases?.attributes?.firmwareVersion || "-"}
                />
                <InfoDisplay
                  caption="License"
                  value={props?.bases?.attributes?.license || "-"}
                />
                <InfoDisplay
                  caption="Working Status"
                  value={props?.bases?.attributes?.workingStatus || "-"}
                />
                {/* <InfoDisplay
                  caption="Status Level"
                  value={props?.bases?.attributes?.statusLevel || "-"}
                />
                <InfoDisplay
                  caption="Gutter Brush Usage"
                  value={props?.bases?.attributes?.gutterBrushUsage || "-"}
                />
                <InfoDisplay
                  caption="Charging Time"
                  value={props?.bases?.attributes?.chargingTime || "-"}
                />
                <InfoDisplay
                  caption="Deployed Time"
                  value={props?.bases?.attributes?.deployedTime || "-"}
                />
                <InfoDisplay
                  caption="Robot Status"
                  value={props?.bases?.attributes?.status || "-"}
                />
                {props?.bases?.attributes?.status == "Cleaning" && (
                  <InfoDisplay
                    caption="Zone Position"
                    value={props?.bases?.attributes?.zonePosition || "-"}
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

export default RobotDetailViewModal;
