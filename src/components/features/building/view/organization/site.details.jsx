"use client";
import Page from "@/components/layout/page";
import useBuilding from "@/hooks/useBuilding";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

const SiteDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const singleBuilding = useBuilding();
  const [buildingData, setBuildingData] = useState({});
  useEffect(() => {
    singleBuilding.fetchSingleData(id);
  }, [id]);

  useEffect(() => {
    setBuildingData(singleBuilding?.singleData);
  }, [buildingData]);
  console.log(buildingData);
  return (
    <Page bread={true} noti={true}>
      <div className="flex items-center gap-3 ml-6 ">
        <FaChevronLeft
          style={{ color: "#004FF0" }}
          className="cursor-pointer"
          onClick={() => router?.back()}
        />
        <span className="text-[#004FF0] w-full text-sm font-normal">Back</span>
      </div>
      <div className=" flex mt-3 ">
        <div className="w-1/4 bg-white rounded-xl  shadow ml-6 p-5">
          <div className="mb-8">
            {/* {organizationData?.logoUrl ? (
              <>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${organizationData?.logoUrl}`}
                  width={80}
                  height={53}
                  alt=""
                />
              </>
            ) : (
              ""
            )} */}
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#7E6E3C] mb-6">
              building Details
            </h2>
            <p className="mb-6">
              <span className="text-[#667085] text-sm font-normal">
                building Name
              </span>
              <br />
              <span className="text-[#344054] font-bold text-base">
                {buildingData?.name}
              </span>
            </p>
            <p className="mb-6">
              <span className="text-[#667085] text-sm font-normal">
                Category
              </span>
              <br />
              <span className="text-[#344054] font-bold text-base">
                {buildingData?.category?.name}
              </span>
            </p>
            <p className="mb-6">
              <span className="text-[#667085] text-sm font-normal">Adress</span>
              <br />
              <span className="text-[#344054] font-bold text-base">
                {buildingData?.address}
              </span>
            </p>

            <p className=" text-[#BFA01D] border mb-6"></p>
            <p className="mb-6">
              <span className="text-[#667085] text-sm font-normal">
                Description
              </span>
              <br />
            </p>

            <p className="mt-2 text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis
              malesuada orci. Curabitur neque nulla, laoreet vitae imperdiet ac,
              hendrerit ut ipsum. Phasellus ultricies a lorem eu molestie.
              Vestibulum convallis sed leo in egestas. Sed leo quam, dapibus ut
              dapibus eu, luctus quis tellus. Vestibulum convallis sed leo in
              egestas. Sed leo quam, dapibus utdapibus eu, luctus quis tellus.
            </p>
            <button className="mt-4 text-blue-500 hover:underline">
              Edit Details
            </button>
          </div>
        </div>
        <div className="w-3/4 p-4"></div>
      </div>
    </Page>
  );
};

export default SiteDetails;
