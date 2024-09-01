import React, { useEffect, useState } from "react";
import IconSearch from "@/components/icons/iconSearch";
import ChecboxInput from "@/components/form/checkbox.input";
import { Controller, useForm } from "react-hook-form";
import useRobotsList from "@/hooks/useRobotsList";

const FilterRobot = ({
  isSelectAll,
  isClearAll,
  label,
  searchLabel,
  isSearch,
  handleFilter,
  value,
  isReseted,
}) => {
  const [allCheck, setAllCheck] = useState(false);

  const [showAll, setShowAll] = useState(false);
  const robots = useRobotsList();
  const { register, control, watch, setValue, reset, getValues } = useForm({
    defaultValues: {
      robotData: value || [],
    },
  });

  useEffect(() => {
    if (isReseted) {
      setValue("robotData", []);
    }
  }, [isReseted]);

  useEffect(() => {
    robots?.fetchData(watch("search"));
  }, [watch("search")]);

  const onAllCheck = (e) => {
    setAllCheck(e.currentTarget.checked);
    if (e.currentTarget.checked) {
      setValue(
        "robotData",
        robots?.data?.map((item) => item?.id)
      );
    } else {
      setValue("robotData", []);
    }
  };
  const onClearAll = (e) => {
    setAllCheck(false);
    setValue("robotData", []);
  };
  const displayedData = showAll ? robots?.data : robots?.data?.slice(0, 12);

  useEffect(() => {
    handleFilter({ robotData: watch("robotData") });
  }, [watch("robotData")]);

  return (
    <div
      className="bg-[#F7F8F9] rounded-lg py-3 px-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center w-full gap-8">
        <p className="text-secondaryFontColor text-sm font-medium min-w-fit">
          {label}
        </p>
        {isSearch && (
          <div className="relative">
            <input
              type="text"
              className={` bg-white relative z-10 text-sm text-bodyTextColor border border-placeholder rounded-[5px] h-[35px] py-[12px] px-[40px] pr-[15px] focus:outline-none shadow-input-shadow`}
              placeholder={searchLabel}
              {...register("search")}
            />
            <div className="cursor-pointer absolute z-10 flex justify-center items-center h-[45px] w-[45px] -top-1 left-0  text-gray">
              <IconSearch />
            </div>
          </div>
        )}

        <div className="w-full flex items-center">
          {isSelectAll && (
            <div className="w-full flex items-center gap-2">
              <input
                type="checkbox"
                id="selectAllRobot"
                checked={allCheck}
                className={"cursor-pointer rounded-2xl"}
                onChange={(e) => {
                  onAllCheck(e);
                }}
              />
              <label
                htmlFor="selectAllRobot"
                className={`text-base font-medium cursor-pointer ${"text-secondaryFontColor"}`}
              >
                Select All
              </label>
            </div>
          )}
          {isClearAll && (
            <div
              htmlFor="clear-all"
              onClick={onClearAll}
              className={`text-base w-full font-medium cursor-pointer ${"text-bodyTextColor"}`}
            >
              Clear All
            </div>
          )}
        </div>
      </div>

      <form className="grid grid-cols-4 mt-4 gap-3">
        {displayedData?.map((item, key) => (
          <Controller
            key={key}
            control={control}
            name={"robotData"}
            render={({ field }) => (
              <ChecboxInput
                index={key}
                label={item?.attributes?.displayName}
                value={item?.id}
                name={"robotData"}
                register={register}
                color="text-black-1"
                field={field}
                setValue={setValue}
              />
            )}
          />
        ))}
      </form>
      {robots?.data?.length > 12 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-primary text-base font-medium"
        >
          {showAll ? "less" : "more"}
        </button>
      )}
    </div>
  );
};

export default FilterRobot;
