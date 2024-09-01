import React, { useEffect, useState } from "react";
import IconSearch from "@/components/icons/iconSearch";
import ChecboxInput from "@/components/form/checkbox.input";
import { Controller, useForm } from "react-hook-form";
import useOrganization from "@/hooks/useOrganization";

const FilterOrganization = ({
  isSelectAll,
  isClearAll,
  label,
  searchLabel,
  isSearch,
  setSelectedOrg,
  handleFilter,
  value,
  isReseted,
}) => {
  const { register, control, watch, setValue, reset } = useForm({
    defaultValues: {
      organization: value || [],
    },
  });
  const { fetchData, data } = useOrganization();

  useEffect(() => {
    fetchData(watch("search"));
  }, [watch("search")]);
  const [allCheck, setAllCheck] = useState(false);

  const [showAll, setShowAll] = useState(false);

  const onAllCheck = (e) => {
    setAllCheck(e.currentTarget.checked);
    if (e.currentTarget.checked) {
      setValue(
        "organization",
        data?.map((item) => item?.id)
      );
    } else {
      setSelectedOrg([]);
      setValue("organization", "");
    }
  };
  const onClearAll = (e) => {
    setAllCheck(false);

    setValue("organization", "");
    setSelectedOrg([]);
  };
  useEffect(() => {
    if (watch("organization")?.length > 0) {
      setSelectedOrg(watch("organization"));
      handleFilter({ organization: watch("organization") });
    } else {
      setSelectedOrg([]);
      handleFilter({ organization: [] });
    }
  }, [watch("organization")]);

  const displayedData = showAll ? data : data?.slice(0, 12);
  useEffect(() => {
    if (isReseted) {
      setValue("organization", "");
      setSelectedOrg([]);
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
                id="select-all"
                checked={allCheck}
                className={"cursor-pointer rounded-2xl"}
                onChange={(e) => {
                  onAllCheck(e);
                }}
              />
              <label
                htmlFor="select-all"
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

      <form className="grid grid-cols-4 mt-4 gap-3">
        {displayedData?.map((item, key) => (
          <Controller
            key={key}
            control={control}
            name={"organization"}
            render={({ field }) => (
              <ChecboxInput
                index={key}
                label={item?.name}
                value={item?.id}
                name={"organization"}
                register={register}
                color="text-black-1"
                field={field}
                setValue={setValue}
              />
            )}
          />
        ))}
      </form>
      {data?.length > 12 && (
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

export default FilterOrganization;
