import { useState } from "react";
import BatteryIcon from "/public/upload/icons/icon_battery_gray.svg";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import InfoDisplay from "../../dashboard/view/InfoDisplay";

import { FaRegEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { isOnlyAdmin } from "@/utils/helper";
import useAuth from "@/hooks/useAuth";

const ViewBuildingDetail = (props) => {
  const { user } = useAuth();
  const handleClose = () => {
    if (props.loading) return;
    props.onClose();
  };
  const router = useRouter();
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
          props.open ? "bottom-1/2 translate-y-1/2" : "-bottom-[650px]"
        } left-1/2 -translate-x-1/2 py-[30px] px-[30px] rounded-[20px] w-[700px]  bg-white text-black-1`}
      >
        <div className="font-bold text-xl">
          <div
            onClick={() => handleClose()}
            className="flex items-end justify-end cursor-pointer"
          >
            <RxCross1 />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="text-titleFontColor text-[16px] font-semibold">
                Logo
              </span>
              {isOnlyAdmin(user?.role) && (
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    router?.push(`/organization/edit/${props?.viewItem?.id}`)
                  }
                >
                  <FaRegEdit color="#BFA01D" />
                </div>
              )}
            </div>
            {props?.viewItem?.organization?.logoUrl && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${props?.viewItem?.organization?.logoUrl}`}
                width={176}
                height={117}
                alt=""
              />
            )}

            <div className="mt-4">
              <p className="text-titleFontColor text-[16px] font-semibold">
                Building Detail
              </p>

              <div className="text-left mt-3">
                <InfoDisplay
                  caption="Building Name"
                  value={props?.viewItem?.name}
                />
                <InfoDisplay
                  caption="Category"
                  value={props?.viewItem?.category}
                />

                <InfoDisplay
                  caption="Address"
                  value={props?.viewItem?.address}
                />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-titleFontColor text-[16px] font-semibold">
                Organization Detail
              </p>
              <div className="text-left mt-3">
                <InfoDisplay
                  caption="Organization"
                  value={props?.viewItem?.organization?.name}
                />
                <InfoDisplay
                  caption="Contact Person"
                  value={props?.viewItem?.contactPerson}
                />
                <InfoDisplay
                  caption="Email"
                  value={props?.viewItem?.emailAddress}
                />
                <InfoDisplay
                  caption="Mobile"
                  value={
                    props?.viewItem?.mobileNumberCode +
                    props?.viewItem?.mobileNumber
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewBuildingDetail;
