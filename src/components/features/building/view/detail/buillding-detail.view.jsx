"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FontHind } from "@/components/fonts";
import IconEditPencilBox from "@/components/icons/iconEditPencilBox";
import IconUsers from "@/components/icons/iconUsers";
import Page from "@/components/layout/page";
import useAuth from "@/hooks/useAuth";
import api from "@/utils/api.axios";
import { isAdmin, RangeColor } from "@/utils/helper";

const RowDetail = (props) => {
  return (
    <div className={`w-full flex text-sm text-black-1 ${FontHind.className}`}>
      <span className="font-semibold min-w-[120px]">{props.title}:</span>
      <span>{props.info}</span>
    </div>
  );
};

const CardBuilding = (props) => {
  return (
    <div
      className={`p-4 border rounded-[10px] w-full text-sm text-black-1 ${FontHind.className}`}
    >
      <div className="font-semibold">{props.title}</div>
      <div className="mt-1">{props.info}</div>
    </div>
  );
};

const CardRobot = (props) => {
  return (
    <div
      className={`flex border rounded-[10px] w-full text-sm text-black-1 ${FontHind.className}`}
    >
      <div>
        <img
          src={props.image}
          className="w-[70px] h-[70px] rounded-l-[10px]"
          alt=""
        />
      </div>
      <div className="p-3.5 flex flex-col justify-start items-start h-[70px]">
        <div className="text-sm font-semibold min-w-[120px]">{props.title}</div>
        <div className={`text-sm`}>{props.info}</div>
      </div>
    </div>
  );
};

const CardReport = (props) => {
  return (
    <div
      className={`p-4 border rounded-[10px] w-full text-sm text-black-1 ${FontHind.className}`}
    >
      <div className="font-semibold">{props.title}</div>
      <div className="mt-1 flex justify-between items-center">
        <span>{props.info}</span>
        <span
          style={{
            color: RangeColor(props.percentage),
          }}
        >
          {props.percentage}%
        </span>
      </div>
    </div>
  );
};

const CardUser = (props) => {
  let arr = props?.item?.name?.split(" ");
  let initial = "";
  let i = 0;
  while (i <= arr.length - 1) {
    initial += arr[i][0];
    i++;
  }

  return (
    <div
      className={`flex border rounded-[10px] w-full text-sm text-black-1 ${FontHind.className}`}
    >
      <div>
        <div className="uppercase font-semibold w-[70px] h-[70px] rounded-l-[10px] flex justify-center items-center text-2xl bg-primary text-white">
          {initial}
        </div>
      </div>
      <div className="p-3.5 flex flex-col justify-center items-start h-[70px]">
        <div className="text-sm font-semibold min-w-[120px]">
          {props?.item?.name}
        </div>
        <div className={`text-sm`}>
          {props.item?.roles?.join(", ").toLowerCase()}
        </div>
      </div>
    </div>
  );
};

const CardUserClicked = (props) => {
  let arr = props?.item?.name?.split(" ");
  let initial = "";
  let i = 0;
  while (i <= arr.length - 1) {
    initial += arr[i][0];
    i++;
  }

  return (
    <a
      href={`/accounts/${props?.item?._id}`}
      className={`flex border rounded-[10px] w-full text-sm text-black-1 ${FontHind.className}`}
    >
      <div>
        <div className="uppercase font-semibold w-[70px] h-[70px] rounded-l-[10px] flex justify-center items-center text-2xl bg-primary text-white">
          {initial}
        </div>
      </div>
      <div className="p-3.5 flex flex-col justify-center items-start h-[70px]">
        <div className="text-sm font-semibold min-w-[120px]">
          {props?.item?.name}
        </div>
        <div className={`text-sm`}>
          {props.item?.roles?.join(", ").toLowerCase()}
        </div>
      </div>
    </a>
  );
};

const BuildingDetailView = () => {
  const { user } = useAuth();
  const TAB = {
    LOCATION: "LOCATION",
    ROBOT: "ROBOT",
    REPORT: "REPORT",
    USER: "USER",
  };
  const router = useRouter();
  const [tab, setTab] = useState(TAB.USER);
  const [building, setBuilding] = useState(null);

  const fetchData = useCallback(async () => {
    const response = await api.get("/building/" + router?.query?.slug[0]);

    if (response?.data?.code === 200) {
      setBuilding(response.data.data);
    }
  }, [router?.query?.slug]);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  return (
    <>
      <Page
        title={
          <div className="flex justify-between items-center space-x-5">
            <label className="text-black-1 font-semibold md:text-lg">
              {building?.name}
            </label>
            {isAdmin(user?.role) && (
              <Link
                href={"/building/edit/" + building?._id}
                className="cursor-pointer"
              >
                <IconEditPencilBox />
              </Link>
            )}
          </div>
        }
      >
        <div className="space-x-5 px-5 flex flex-col md:flex-row w-full text-black">
          <div className="w-full space-y-2.5">
            <div className="bg-white rounded-[10px] p-2 md:p-5 grid grid-cols-3 gap-5">
              <div className="space-y-2.5">
                <div className="text-primary font-semibold">
                  Building Details
                </div>
                <RowDetail title="Building Name" info={building?.name} />
                <RowDetail title="Category" info={building?.category?.name} />
                <RowDetail
                  title="Address"
                  info={`${building?.address}, ${building?.country?.name} ${building?.postalCode}`}
                />
              </div>
              <div className="space-y-2.5">
                <div className="text-primary font-semibold">
                  Organization Details
                </div>
                <RowDetail
                  title="Organization"
                  info={building?.organization?.name}
                />
                <RowDetail
                  title="Contact Person"
                  info={building?.contactPerson}
                />
                <RowDetail title="Email:" info={building?.emailAddress} />
                <RowDetail
                  title="Mobile"
                  info={`${building?.phoneCode || ""}${
                    building?.phoneNumber || ""
                  }`}
                />
              </div>
              <div className="space-y-2.5">
                <div className="text-primary font-semibold">Logo</div>
                <div
                  className={`w-full flex flex-col text-sm text-black-1 ${FontHind.className}`}
                >
                  {building?.organization?.logo !== "" && (
                    <img
                      src={building?.organization?.logo || ""}
                      className="w-2/3 h-full object-contain mt-2"
                      alt=""
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:max-w-[280px]">
            <div className="bg-white-1 w-full rounded-[10px]">
              <div className="w-full flex h-[50px]">
                {/* <div
                  onClick={() => setTab(TAB.LOCATION)}
                  className={`${
                    tab === TAB.LOCATION
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary"
                  } cursor-pointer hover:bg-primary hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconCleaningPlan />
                </div> */}
                {/* <div
                  onClick={() => setTab(TAB.ROBOT)}
                  className={`${
                    tab === TAB.ROBOT
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary"
                  } cursor-pointer hover:bg-primary hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconRobot />
                </div> */}
                {/* <div
                  onClick={() => setTab(TAB.REPORT)}
                  className={`${
                    tab === TAB.REPORT
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary"
                  } cursor-pointer hover:bg-primary hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconReports />
                </div> */}
                <div
                  onClick={() => setTab(TAB.USER)}
                  className={`${
                    tab === TAB.USER
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary"
                  } cursor-pointer hover:bg-primary hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconUsers />
                </div>
              </div>

              {/* TAB LOCATION */}
              {tab === TAB.LOCATION && (
                <div className="bg-white p-4">
                  <div className="space-y-2.5">
                    <CardBuilding title="T3 Departure L1" info="123 m2" />
                    <CardBuilding title="T3 Departure L1" info="123 m2" />
                  </div>
                </div>
              )}

              {/* TAB ROBOT */}
              {false && (
                <div className="bg-white p-4">
                  {/*<div className="flex py-1.5 h-[45px] item-center space-x-2.5">
                    <button className="text-xs text-white bg-primary rounded-full py-2 px-4">
                      All
                    </button>

                    <button className="text-xs text-primary bg-white-1 rounded-full py-2 px-4">
                      Base
                    </button>

                    <button className="text-xs text-primary bg-white-1 rounded-full py-2 px-4">
                      Module
                    </button>
                  </div>*/}
                  <div className=" mt-2 space-y-2.5">
                    <CardRobot
                      image="/assets/images/thumb_robot.png"
                      title="Base_ID"
                      info=""
                    />
                    <CardRobot
                      image="/assets/images/thumb_robot.png"
                      title="Base_ID"
                      info=""
                    />
                  </div>
                </div>
              )}

              {/* TAB REPORT */}
              {tab === TAB.REPORT && (
                <div className="bg-white p-4">
                  {/* <div className={`text-sm ${FontHind.className}`}>
                    Filter report by date
                  </div>
                  <div className="relative flex space-x-2 w-full my-2">
                    <input
                      type="date"
                      className={`bg-white relative z-10 w-full text-xs text-black-1 border-2 border-white-1 rounded-[10px] h-[40px] py-[10px] px-[8px] focus:outline-none`}
                    />
                    <input
                      type="date"
                      className={`bg-white relative z-10 w-full text-xs text-black-1 border-2 border-white-1 rounded-[10px] h-[40px] py-[10px] px-[8px] focus:outline-none`}
                    />
                  </div> */}
                  <div className={`text-sm ${FontHind.className}`}>
                    2 reports found
                  </div>
                  <div className="mt-2 space-y-2.5">
                    <CardReport
                      title="Report Name"
                      info="20/02/2022, 11:00:00"
                      percentage={90}
                    />
                    <CardReport
                      title="Report Name"
                      info="20/02/2022, 11:00:00"
                      percentage={90}
                    />
                  </div>
                </div>
              )}

              {/* TAB USER */}
              {tab === TAB.USER && (
                <div className="bg-white p-4">
                  <div className="space-y-2.5">
                    {building?.users?.map((item, key) => {
                      return (
                        <>
                          {isAdmin(user?.role) ? (
                            <CardUserClicked key={key} item={item} />
                          ) : (
                            <CardUser key={key} item={item} />
                          )}
                        </>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Page>
    </>
  );
};

export default BuildingDetailView;
