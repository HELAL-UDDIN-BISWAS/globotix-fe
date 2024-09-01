import React, { useEffect, useState } from "react";
import IconSearch from "@/components/icons/iconSearch";
import ChecboxInput from "@/components/form/checkbox.input";
import { Controller, useForm } from "react-hook-form";
import useLocation from "@/hooks/useLocation";

const FilterMap = ({
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
  const location = useLocation();
  const { register, control, watch, setValue, reset } = useForm({
    defaultValues: {
      map: value || [],
    },
  });

  useEffect(() => {
    location.fetchMapNames();
  }, []);

  useEffect(() => {
    location?.fetchMapNames(watch("search"));
  }, [watch("search")]);

  const onAllCheck = (e) => {
    setAllCheck(e.currentTarget.checked);
    if (e.currentTarget.checked) {
      setValue(
        "map",
        location?.mapNames?.map((item) => item)
      );
    } else {
      setValue("map", "");
    }
  };
  const onClearAll = (e) => {
    setAllCheck(false);
    setValue("map", "");
  };
  const displayedData = showAll
    ? location?.mapNames
    : location?.mapNames?.slice(0, 12);

  const selectedMap = watch("map");
  useEffect(() => {
    handleFilter({ map: selectedMap });
  }, [selectedMap]);

  useEffect(() => {
    if (isReseted) {
      setValue("map", "");
    }
  }, [isReseted]);

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
                id="selectAll"
                checked={allCheck}
                className={"cursor-pointer rounded-2xl"}
                onChange={(e) => {
                  onAllCheck(e);
                }}
              />
              <label
                htmlFor="selectAll"
                className={`text-base font-medium cursor-pointer ${"text-secondaryFontColor"}`}
              >
                Select All
              </label>
            </div>
          )}
          {isClearAll && (
            <div
              htmlFor="select-all"
              onClick={onClearAll}
              className={`text-base w-full font-medium cursor-pointer ${"text-bodyTextColor"}`}
            >
              Clear All
            </div>
          )}
        </div>
      </div>

      <form className="grid grid-cols-4 mt-4 gap-3 ">
        {displayedData?.map((item, key) => (
          <Controller
            key={key}
            control={control}
            name={"map"}
            render={({ field }) => (
              <ChecboxInput
                index={key}
                label={item}
                value={item}
                name={"map"}
                register={register}
                color="text-black-1"
                field={field}
                setValue={setValue}
                isReseted={isReseted}
              />
            )}
          />
        ))}
      </form>
      {location?.mapNames?.length > 12 && (
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

export default FilterMap;
