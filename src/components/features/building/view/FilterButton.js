import React, { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import FilterStatus from "../filter/filterStatus";
import FilterCategory from "../filter/filterCategory";
import FilterContactPerson from "../filter/filterContactPerson";
import FilterBuilding from "../filter/filterBuilding";

const FilterButton = ({
  openModal,
  toggle,
  filter,
  resetFilter,
  applyFilter,
  handleFilter,
  isReseted,
}) => {
  return (
    <Popover open={openModal} onOpenChange={toggle}>
      <PopoverTrigger>
        <button className="min-w-[124px] flex items-center justify-between px-3  border border-primary h-[45px] rounded-[10px] bg-primary02">
          <span className="text-primary font-semibold">Filter</span>
          <span>
            <CiFilter fill="#BFA01D" size={21} />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[850px] max-w-[850px] w-full ms-[30%] mt-3">
        <div className="w-full  bg-white shadow-md py-4 px-3 rounded-md flex flex-col gap-2">
          <h3 className="text-[16px] font-semibold text-bodyTextColor">
            Filters
          </h3>
          <div className="max-h-[65vh] overflow-auto flex flex-col gap-2">
            <FilterStatus
              isSelectAll={false}
              isClearAll={true}
              label={"Filter By Status"}
              isSearch={false}
              handleFilter={(val) => handleFilter(val)}
              value={filter?.status}
              isReseted={isReseted}
            />
            <FilterCategory
              isClearAll={true}
              label={"Filter By Category"}
              handleFilter={(val) => handleFilter(val)}
              value={filter?.category}
              isReseted={isReseted}
            />
            <FilterContactPerson
              isSelectAll={true}
              isClearAll={true}
              label={"Filter By Contact Person"}
              isSearch={true}
              searchLabel={"Search Person"}
              handleFilter={(val) => handleFilter(val)}
              value={filter?.contactPerson}
              isReseted={isReseted}
            />
            <FilterBuilding
              isSelectAll={true}
              isClearAll={true}
              label={"Filter By Building"}
              isSearch={true}
              searchLabel={"Search building"}
              handleFilter={(val) => handleFilter(val)}
              value={filter?.building}
              isReseted={isReseted}
            />
          </div>
          <div className="flex justify-between py-2">
            <button
              className={`w-[170px] text-primary flex items-center justify-center py-4 px-5 h-[45px]  rounded-[10px]   bg-primary02 border border-primary
                }`}
              onClick={(e) => {
                e.stopPropagation();
                resetFilter();
              }}
            >
              Reset Changes
            </button>
            <button
              className={`w-[170px] text-white flex items-center justify-center py-4 px-5 h-[45px]  rounded-[10px]   bg-primary
                }`}
              onClick={applyFilter}
            >
              Apply
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterButton;
