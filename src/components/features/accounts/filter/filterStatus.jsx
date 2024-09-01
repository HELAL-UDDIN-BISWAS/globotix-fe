import React, { useEffect, useState } from "react";
import ChecboxInput from "@/components/form/checkbox.input";
import { Controller, useForm } from "react-hook-form";
let listStatus = ["Active", "Inactive"];
const FilterStatus = ({
  isClearAll,
  label,
  handleFilter,
  value,
  isReseted,
}) => {
  const { register, control, watch, setValue, reset } = useForm({
    defaultValues: {
      status: value || [],
    },
  });

  const onClearAll = (e) => {
    setValue("status", "");
  };

  useEffect(() => {
    if (isReseted) {
      setValue("status", "");
    }
  }, [isReseted]);
  const selectedStatuses = watch("status");
  useEffect(() => {
    handleFilter({ status: selectedStatuses });
  }, [selectedStatuses]);
  return (
    <div
      className="bg-[#F7F8F9] rounded-lg py-3 px-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center w-full gap-8">
        <p className="text-secondaryFontColor text-sm font-medium min-w-fit">
          {label}
        </p>

        <div className="w-full flex items-center">
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
        {listStatus?.map((item, key) => (
          <Controller
            key={key}
            control={control}
            name={"status"}
            render={({ field }) => (
              <ChecboxInput
                index={key}
                label={item}
                value={item}
                name={"status"}
                register={register}
                color="text-black-1"
                field={field}
                setValue={setValue}
                control={control}
              />
            )}
          />
        ))}
      </form>
    </div>
  );
};

export default FilterStatus;
