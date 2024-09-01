import Button from "@/components/common/button";
import SearchInput from "@/components/form/searchinput";
import useAuth from "@/hooks/useAuth";
import { isAdmin } from "@/utils/helper";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross1 } from "react-icons/rx";
import TableCleaningPlan from "./cleaning-plan-table";
import SecondaryButton from "@/components/button/SecondaryButton";
import { FontHind } from "@/components/fonts";
import IconSearch from "@/components/icons/iconSearch";
import IconHistory from "@/components/icons/iconHistory";
import { useRouter } from "next/navigation";

const CleaningPlanTable = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedData, setSelectedData] = useState(null);
  const [focus, setFocus] = useState(false);
  const handleClose = () => {
    if (props.loading) return;
    props.onClose();
    props.setQuery({ keywords: "", page: 1, pageSize: 10 });
  };
  const { user } = useAuth();
  const router = useRouter();

  const handleNewCleaningPlanClick = () => {
    const formData = props?.getValues();
    sessionStorage.setItem("scheduleFormData", JSON.stringify(formData));
    router.push("/cleaning-plan/add?mode=detail&from=schedule");
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
        } left-1/2 -translate-x-1/2 py-[30px] px-[30px] rounded-[20px] w-[70%]  bg-white text-black-1`}
      >
        <div className="font-bold text-xl text-center">
          <div
            onClick={() => handleClose()}
            className="flex items-end justify-end cursor-pointer"
          >
            <RxCross1 />
          </div>
          <div className="flex flex-col md:flex-row items-center md:justify-between md:mt-6 mt-3 gap-2 md:gap-0">
            <div className="relative">
              <div className="flex">
                <div className="w-full relative">
                  <input
                    type="text"
                    value={props?.query?.keywords}
                    onChange={(e) => props?.handleSearch(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlurCapture={() => setFocus(false)}
                    className={`bg-white relative z-10 w-full text-sm text-bodyTextColor border-none rounded-[10px] h-[45px] py-[12px] px-[15px] pr-[40px] focus:outline-none shadow-input-shadow`}
                    placeholder="Search"
                  />
                  <div className="cursor-pointer absolute z-10 flex justify-center items-center h-[45px] w-[45px] top-0 right-0  text-primary">
                    <IconSearch />
                  </div>
                  {focus && (
                    <div className="absolute top-[3px]  w-full h-[45px] bg-primary rounded-[10px]"></div>
                  )}
                </div>
              </div>
            </div>

            {isAdmin(user?.role) && (
              // <Link href="/cleaning-plan/add?mode=detail&from=schedule" >
              <Button type="button" onClick={handleNewCleaningPlanClick}>
                <span className="text-sm text-white ">+ New Cleaning Plan</span>
              </Button>
              // </Link>
            )}
          </div>
          <div className=" mt-6 w-full overflow-auto">
            <TableCleaningPlan
              data={props?.data || []}
              onSelect={(val) => setSelectedData(val)}
              pageCount={props.pageCount}
              handlePageChange={props.handlePageChange}
              query={props?.query}
              planId={props?.choosePlanId}
            />
          </div>
          <div className="flex justify-between items-center space-x-5 mt-5">
            <SecondaryButton
              onClick={() => handleClose()}
              type="button"
              className={`w-max font-semibold flex items-center bg-primary02 border border-primary justify-center py-4 px-5 h-[45px] rounded-[10px]  `}
            >
              <div className="flex text-sm space-x-2 w-max justify-center items-center text-primary">
                Back
              </div>
            </SecondaryButton>
            <Button
              type="button"
              formNoValidate="formnovalidate"
              onClick={() => props.setPlanName(selectedData)}
            >
              <span className="text-sm text-white">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CleaningPlanTable;
