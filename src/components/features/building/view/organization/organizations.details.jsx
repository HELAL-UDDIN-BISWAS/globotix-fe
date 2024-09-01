"use client";

import Button from "@/components/common/button";
import Page from "@/components/layout/page";
import useAuth from "@/hooks/useAuth";
import useOrganization from "@/hooks/useOrganization";
import { isAdmin, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FaChevronLeft } from "react-icons/fa";
import TableOrganizationsDetails from "./organizations.table";
import Image from "next/image";

const OrganizationDetailsView = () => {
  const [organizationData, setOrganizationData] = useState(null);
  const organization = useOrganization();
  const { user } = useAuth();
  const router = useRouter();
  const { slug } = useParams();
  console.log(slug);
  const filterData = slug[0]
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  useEffect(() => {
    organization.fetchSingleOrgData(filterData);
  }, []);
  useEffect(() => {
    if (isSuperAdmin(user?.role)) {
      setOrganizationData(organization?.singleOrgData);
    }
  }, [organization.singleOrgData]);
  console.log(organizationData);
  const sitesData = organizationData?.buildings?.map((site) => {
    const building = site?.attributes;
    return {
      id: site?.id,
      name: building?.name,
      total_assignedRobots: building?.assignedRobots?.data?.length,
      total_users: building?.users?.data?.length,
    };
  });

  console.log(sitesData);
  console.log(`${process.env.NEXT_PUBLIC_API_URL}${organizationData?.logoUrl}`);
  const handleView = (row, organizationSlug) => {
    console.log(row, organizationSlug);
    const url = `/organization/${organizationSlug}/${row?.name?.toLowerCase().replace(/\s+/g, "-")}?id=${row?.id}`;
    router.push(url);
  };

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
            {organizationData?.logoUrl ? (
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
            )}
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#7E6E3C] mb-6">
              Organisation Details
            </h2>
            <p className="mb-6">
              <span className="text-[#667085] text-sm font-normal">
                Organisation
              </span>
              <br />
              <span className="text-[#344054] font-bold text-base">
                {organizationData?.name}
              </span>
            </p>
            <p className="mb-6">
              <span className="text-[#667085] text-sm font-normal">
                Contact personnel
              </span>
              <br />
              <span className="text-[#344054] font-bold text-base">
                {organizationData?.contactPerson}
              </span>
            </p>
            <p className="mb-6">
              <span className="text-[#667085] text-sm font-normal">Email</span>
              <br />
              <span className="text-[#344054] font-bold text-base">
                {organizationData?.email}
              </span>
            </p>
            {organizationData?.mobileNumber && (
              <p className="mb-6">
                <span className="text-[#667085] text-sm font-normal">
                  Contact Number
                </span>
                <br />
                <span className="text-[#344054] font-bold text-base">
                  {organizationData?.mobileNumber}
                </span>
              </p>
            )}
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
              dapibus eu, luctus quis tellus.
            </p>
            <button className="mt-4 text-blue-500 hover:underline">
              Edit Details
            </button>
          </div>
        </div>
        <div className="w-3/4 p-4">
          <div className="w-full flex justify-between mt-3 items-center">
            <div className="flex space-x-5 text-[#BFA01D] text-2xl">
              Sites{" "}
              <span className="text-[#667085] ml-3">
                {organizationData?.total_building}
              </span>
            </div>
            {isAdmin(user?.role) && (
              <Link href="/organization/add">
                <Button>
                  <span className="text-sm text-white">+ Site</span>
                </Button>
              </Link>
            )}
          </div>

          <TableOrganizationsDetails
            data={sitesData || []}
            //   onDelete={() => handleOpenDelete(val)}
            //   onBulkDelete={(val) => handleOpenDelete(val)}
            onView={(val, organizationSlug) =>
              handleView(val, organizationSlug)
            }
          />
        </div>
      </div>
    </Page>
  );
};

export default OrganizationDetailsView;
