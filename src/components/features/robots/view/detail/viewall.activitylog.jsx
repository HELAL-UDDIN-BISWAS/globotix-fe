import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoCloseOutline, IoEyeOutline } from "react-icons/io5";
import BotBaseActivityLog from "./bot-base-activitylog";

const ViewallActivitylog = ({ reportData = [] }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-hyperLinkColor flex items-center gap-1 cursor-pointer ml-auto">
          View all <IoEyeOutline size={18} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-xl font-semibold text-titleFontColor flex gap-[5px] items-center justify-between mb-4">
            Activity Log
            <Dialog.Close asChild>
              <button aria-label="Close">
                <IoCloseOutline size={24} />
              </button>
            </Dialog.Close>
          </Dialog.Title>
          <div className="h-[500px] overflow-y-auto">
            <BotBaseActivityLog
              reportData={reportData}
              itemCount={reportData?.length + 1}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ViewallActivitylog;
