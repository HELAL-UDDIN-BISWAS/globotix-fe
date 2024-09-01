import React, { useEffect, useState } from "react";
import ChecboxInput from "@/components/form/checkbox.input";
import { Controller, useForm } from "react-hook-form";
import useCategory from "@/hooks/useCategory";

const FilterCategory = ({
  isClearAll,
  label,
  handleFilter,
  value,
  isReseted,
}) => {
  const [allCheck, setAllCheck] = useState(false);

  const [showAll, setShowAll] = useState(false);
  const { getAllCategory, listCategory } = useCategory();
  const { register, control, watch, setValue, reset } = useForm({
    defaultValues: {
      category: value || [],
    },
  });

  useEffect(() => {
    getAllCategory(watch("search"));
  }, []);

  const onClearAll = (e) => {
    setAllCheck(false);
    setValue("category", "");
  };
  const displayedData = showAll ? listCategory : listCategory?.slice(0, 12);

  const selectedCategory = watch("category");
  useEffect(() => {
    handleFilter({ category: selectedCategory });
  }, [selectedCategory]);

  useEffect(() => {
    if (isReseted) {
      setValue("category", "");
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
        {displayedData?.map((item, key) => (
          <Controller
            key={key}
            control={control}
            name={"category"}
            render={({ field }) => (
              <ChecboxInput
                index={key}
                label={item?.name}
                value={item?.id}
                name={"category"}
                register={register}
                color="text-black-1"
                field={field}
                setValue={setValue}
              />
            )}
          />
        ))}
      </form>
      {listCategory?.length > 12 && (
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

export default FilterCategory;
