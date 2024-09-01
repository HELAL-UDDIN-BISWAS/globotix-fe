import ActionMenu from "@/components/share/dropdown/actionMenu";
import useSchedule from "@/hooks/useSchedule";
import { convertTo12HourFormat, getDayOfWeek } from "@/utils/helper";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import ScheduleDetailViewModal from "./schedule-detail-view-modal";

const ScheduleList = ({ fetchSchedulesByDate, fetchSchedulesByMonth }) => {
  const router = useRouter();
  const { schedules, deleteSchedule, loading } = useSchedule();
  const [viewModal, setViewModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleDelete = async (id) => {
    const response = await deleteSchedule({ id });
    if (response?.status == 200) {
      await fetchSchedulesByMonth();
      await fetchSchedulesByDate();
    }
  };

  if (!loading && schedules.length == 0) {
    return (
      <div className="min-w-[320px] text-center">
        <Image
          alt="no-schdule"
          src={"/upload/images/no-schedule.svg"}
          width={318}
          height={256}
        />
        <span className="text-bodyTextColor text-base font-bold">
          No schedule.
        </span>
      </div>
    );
  }

  if (!loading && schedules) {
    return (
      <div>
        {schedules?.map((schedule, index) => (
          <div
            key={index}
            className="border-none rounded-[10px] mb-2 bg-white min-w-[320px]"
          >
            <div className="flex items-center text-white bg-primary text-xl font-semibold px-5 py-4 rounded-t-[10px]">
              <span>{schedule?.name}</span>
              <div className="ml-auto">
                <ActionMenu
                  view
                  onViewClick={() => {
                    setSelectedSchedule(schedule);
                    setViewModal(true);
                  }}
                  edit
                  onEditClick={() => {
                    router.push(`/schedule/edit/${schedule?.id}`);
                  }}
                  deleteAction
                  onDeleteClick={() => {
                    handleDelete(schedule?.id);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col p-5 gap-2">
              <div className="text-secondaryFontColor text-xs flex gap-[5px]">
                <span className="font-bold">
                  {getDayOfWeek(schedule?.cleaningDate).toUpperCase()}
                </span>
                <span>
                  {dayjs(schedule?.cleaningDate).format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="flex gap-[5px]">
                <GoDotFill size={20} className=" color-primary text-primary" />
                <div className="flex flex-col gap-[5px] text-sm font-semibold">
                  <div className="flex gap-[5px]">
                    <span className="text-secondaryFontColor">
                      Cleaning Time{" "}
                    </span>
                    <span className="text-titleFontColor">
                      : {convertTo12HourFormat(schedule?.cleaningTime)}
                    </span>
                  </div>
                  <div className="flex gap-[5px]">
                    <span className="text-secondaryFontColor">
                      Cleaning Plan:{" "}
                    </span>
                    <span className="text-titleFontColor">
                      : {schedule?.cleaningPlan?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <ScheduleDetailViewModal
          open={viewModal}
          onClose={() => setViewModal(false)}
          scheduleData={selectedSchedule}
        />
      </div>
    );
  }
};

export default ScheduleList;
