import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { SlOptionsVertical } from "react-icons/sl";
import React from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { PiScrollBold } from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";

const ActionMenu = ({
  view = false,
  onViewClick = () => {},
  onViewMouseDown = () => {},
  edit = false,
  onEditClick = () => {},
  report = false,
  onReportClick = () => {},
  deleteAction = false,
  onDeleteClick = () => {},
  viewLabel = "View",
  editLabel = "Edit",
}) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <SlOptionsVertical
          color="secondaryFontColor"
          className="cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border-none p-0 text-secondaryFontColor ">
        {view && (
          <DropdownMenuItem
            onClick={onViewClick}
            onMouseDown={onViewMouseDown}
            className="hover:bg-primary border-b border-gray hover:text-white flex align-center gap-[12px] px-4 py-[12px]"
          >
            <MdOutlineRemoveRedEye size={20} />
            <span className="text-sm font-semibold">{viewLabel}</span>
          </DropdownMenuItem>
        )}
        {report && (
          <DropdownMenuItem
            onClick={onReportClick}
            className="hover:bg-primary border-b border-gray hover:text-white flex align-center gap-[12px] px-4 py-[12px]"
          >
            <PiScrollBold size={20} />
            <span className="text-sm font-semibold">Report</span>
          </DropdownMenuItem>
        )}
        {edit && (
          <DropdownMenuItem
            onClick={onEditClick}
            className="hover:bg-primary border-b border-gray hover:text-white flex align-center gap-[12px] px-4 py-[12px]"
          >
            <GoPencil size={20} />
            <span className="text-sm font-semibold">{editLabel}</span>
          </DropdownMenuItem>
        )}
        {deleteAction && (
          <DropdownMenuItem
            onClick={onDeleteClick}
            className="hover:bg-primary border-b border-gray hover:text-white flex align-center gap-[12px] px-4 py-[12px]"
          >
            <RiDeleteBin6Line size={20} />
            <span className="text-sm font-semibold">Delete</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;
