import { RxCross1 } from "react-icons/rx";
import InfoDisplay from "../dashboard/view/InfoDisplay";
import dayjs from "dayjs";
import moment from "moment";

const ScheduleDetailViewModal = (props) => {
  const handleClose = () => {
    if (props.loading) return;
    props.onClose();
  };
  const formatTimeString = (timeString) => {
    const momentObj = moment(timeString, [
      "HH:mm:ss.SSS",
      "HH:mm:ss",
      "HH:mm",
      "HH",
    ]);
    return momentObj.isValid()
      ? momentObj.format("HH:mm")
      : "Invalid time format";
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
        } left-1/2 -translate-x-1/2 py-[30px] px-[30px] rounded-[20px] w-[500px]  bg-white text-black-1`}
      >
        <div className="font-bold text-xl text-center">
          <div
            onClick={() => handleClose()}
            className="flex items-end justify-end cursor-pointer"
          >
            <RxCross1 />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="mt-4">
              <p className="text-lg font-semibold text-bodyTextColor">
                General Information
              </p>

              <div className="h-[300px] mt-3 px-12 no-scrollbar overflow-y-scroll ">
                <InfoDisplay
                  caption="Schedule Name"
                  value={props?.scheduleData?.name || "-"}
                />
                <InfoDisplay
                  caption="Cleaning Date"
                  value={
                    dayjs(props?.scheduleData?.cleanignDate).format(
                      "DD/MM/YYYY"
                    ) || "-"
                  }
                />
                <InfoDisplay
                  caption="Cleaning Time"
                  value={
                    formatTimeString(props?.scheduleData?.cleaningTime) || "-"
                  }
                />
                <InfoDisplay
                  caption="Schedule Type"
                  value={"Auto Docking" || "-"}
                />
                <InfoDisplay
                  caption="Frequency"
                  value={props?.scheduleData?.frequency || "-"}
                />
                <InfoDisplay
                  caption="Location"
                  value={
                    props?.scheduleData?.cleaningPlan?.location?.name || "-"
                  }
                />
                <InfoDisplay
                  caption="Cleaning Plan"
                  value={props?.scheduleData?.cleaningPlan?.name || "-"}
                />

                <InfoDisplay
                  caption="Zones"
                  // value={
                  //   props?.scheduleData?.zones?.map((zone, index) => {
                  //     return (
                  //       <>
                  //         <span>
                  //           {index > 0 && "\u00A0"}
                  //           {zone?.title}
                  //         </span>
                  //         <br />
                  //       </>
                  //     );
                  //   }) || "-"
                  // }
                  value={props?.scheduleData?.cleaningPlan?.cleanZones?.map(
                    (zone) => zone?.name
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleDetailViewModal;
