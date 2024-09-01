import React, { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";

import SecondaryButton from "@/components/button/SecondaryButton";
import Button from "@/components/common/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import FilterAccessLevel from "../filter/filterAccessLevel";
import FilterBuilding from "../filter/filterBuilding";
import FilterOrganization from "../filter/filterOrganization";
import FilterStatus from "../filter/filterStatus";

const FilterButton = ({
  openModal,
  toggle,
  filter,
  resetFilter,
  applyFilter,
  handleFilter,
  isReseted,
}) => {
  const [selectedOrg, setSelectedOrg] = useState(null);
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
            <FilterAccessLevel
              isSelectAll={false}
              isClearAll={true}
              label={"Filter By Access Level"}
              isSearch={false}
              handleFilter={(val) => handleFilter(val)}
              value={filter?.accessLevel}
              isReseted={isReseted}
            />
            <FilterOrganization
              isSelectAll={true}
              isClearAll={true}
              label={"Filter By Organization"}
              isSearch={true}
              searchLabel={"Search Organization"}
              setSelectedOrg={setSelectedOrg}
              handleFilter={(val) => handleFilter(val)}
              value={filter?.organization}
              isReseted={isReseted}
            />
            <FilterBuilding
              isSelectAll={true}
              isClearAll={true}
              label={"Filter By Building"}
              isSearch={true}
              searchLabel={"Search building"}
              org={selectedOrg}
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
