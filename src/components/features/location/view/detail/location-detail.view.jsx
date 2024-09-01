"use client";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FontHind } from "@/components/fonts";
import IconCleaningPlan from "@/components/icons/iconCleaningPlan";
import IconReports from "@/components/icons/iconReports";
import IconRobot from "@/components/icons/iconRobot";
import Page from "@/components/layout/page";
import api from "@/utils/api.axios";
import { RangeColor } from "@/utils/helper";

import CleaningPlanView from "../cleaning-plan/cleaningPlan";
import ButtonDownloadPDFLocation from "../download-pdf.button";

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
      <div className="p-3.5 flex flex-col justify-center items-start h-[70px]">
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

const CardZone = (props) => {
  const arrLoc = ["Hard Floor", "Carpet", "Custom"];

  return (
    <div className="border border-white-1 rounded-[10px]">
      <div className="flex flex-col pt-4 px-2 pb-2.5">
        <label className="text-sm text-blue-2 font-semibold mb-[6px]">
          {props?.item?.zone_name}
        </label>
        <div className="flex w-full justify-between text-sm">
          <span className="text-blue-2">{props?.item?.zone_type}</span>
          {/* <div className="flex">
            <ButtonIcon onClick={() => {}} icon={<IconEditPencilBoxSmall />} />
            <ButtonIcon onClick={() => {}} icon={<IconCopy />} />
          </div> */}
        </div>
      </div>
      {/* <div class="flex space-x-2.5 py-2 px-2.5 bg-blue-2 rounded-b-[10px]">
        <div className="flex justify-start items-center">
          <Image
            src="/assets/icons/icon_speed.svg"
            width={14}
            height={14}
            alt=""
          />
          <span className="ml-1.5 text-white text-[11px]">Slow</span>
        </div>
        <div className="flex justify-start items-center">
          <Image
            src="/assets/icons/icon_eco.svg"
            width={14}
            height={14}
            alt=""
          />
          <span className="ml-1.5 text-white text-[11px]">Eco</span>
        </div>
        <div className="flex justify-start items-center">
          <Image
            src="/assets/icons/icon_brush.svg"
            width={14}
            height={14}
            alt=""
          />
          <span className="ml-1.5 text-white text-[11px]">Normal</span>
        </div>
      </div> */}
    </div>
  );
};

const Legend = (props) => {
  return (
    <div className="cursor-pointer flex space-x-2  h-full ">
      <div
        className={`border-2 w-[30px] h-[15px]`}
        style={{
          background: props.bgColor,
          borderColor: props.borderColor,
        }}
      ></div>
      <span className="text-xs text-black-1 h-[15px] justify-center items-center flex w-full">
        {props.text}
      </span>
    </div>
  );
};

const LocationDetailView = () => {
  const [openManageCleaningPlan, setOpenManageCleaningPlan] = useState(false);
  const TAB = {
    CLEANING_PLAN: "CLEANING_PLAN",
    ROBOT: "ROBOT",
    REPORT: "REPORT",
    BOOK_LEGEND: "BOOK_LEGEND",
  };
  const router = useRouter();
  const [tab, setTab] = useState(TAB.CLEANING_PLAN);
  const [location, setLocation] = useState(null);
  const [zone, setZone] = useState();
  const [homes, setHomes] = useState();
  const [cleaningPlan, setCleaningPlan] = useState();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchData = useCallback(async () => {
    const response = await api.get("/locations/" + router?.query?.slug[0]);

    if (response?.data?.code === 200) {
      setLocation(response.data.data);
    }
  }, [router?.query?.slug]);

  const fetchDataZone = useCallback(async () => {
    const response = await api.get(
      "/locations/" + router?.query?.slug[0] + "/zones"
    );

    if (response?.data?.code === 200) {
      setZone(response.data.data);
    }
  }, [router?.query?.slug]);

  const fetchDataHomes = useCallback(async () => {
    const response = await api.get(
      "/locations/" + router?.query?.slug[0] + "/homes"
    );

    if (response?.data?.code === 200) {
      setHomes(response.data.data);
    }
  }, [router?.query?.slug]);

  const fetchDataCleaningPlans = useCallback(async () => {
    const response = await api.get(
      "/locations/" + router?.query?.slug[0] + "/cleaning-plans"
    );

    if (response?.data?.code === 200) {
      setCleaningPlan(response.data.data);
    }
  }, [router?.query?.slug]);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  useEffect(() => {
    fetchDataZone().catch(console.error);
  }, [fetchDataZone]);

  useEffect(() => {
    fetchDataHomes().catch(console.error);
  }, [fetchDataHomes]);

  useEffect(() => {
    fetchDataCleaningPlans().catch(console.error);
  }, [fetchDataCleaningPlans]);

  const handleCloseManageCleaningPlan = () => {
    setOpenManageCleaningPlan(false);
  };

  return (
    <>
      <CleaningPlanView
        open={openManageCleaningPlan}
        onClose={() => handleCloseManageCleaningPlan()}
      />

      <Page
        title={
          <div className="flex justify-between items-center space-x-5">
            <label className="text-black-1 font-semibold md:text-lg">
              {location?.location_name}
            </label>
            {/* <Link href={"#"} className="cursor-pointer">
              <IconEditPencilBox />
            </Link> */}
          </div>
        }
        header={
          <div className="flex space-x-2">
            <ButtonDownloadPDFLocation dataDetail={null} />
            {/* <ButtonNotification />
            <ButtonHelper /> */}
          </div>
        }
      >
        <div className="space-x-5 px-5 flex flex-col md:flex-row w-full text-black">
          <div className="w-full bg-white rounded-[10px]">
            <div className="flex flex-col w-full ">
              <div className="md:hidden w-full flex justify-center items-start mb-[30px] mt-6">
                <img
                  src={location?.map_url}
                  className="w-full object-contain"
                  alt=""
                />
              </div>

              <div className="hidden md:flex w-full  justify-center items-start mb-[30px]  mt-6">
                <img
                  src={location?.map_url}
                  className="w-[300px] object-contain"
                  alt=""
                />
              </div>

              <div className="hidden flex-wrap justify-center items-center w-full mt-auto space-x-5 my-6">
                <Legend
                  text="Cleaning Zones"
                  bgColor="#d6d9dd80"
                  borderColor="#D6D9DD "
                />
                <Legend
                  text="Obstacle"
                  bgColor="#cf000080"
                  borderColor="#CF0000 "
                />
                <Legend
                  text="No-Go Zones"
                  bgColor="#a1931c80"
                  borderColor="#A1931C"
                />
                <Legend
                  text="No-Clean Zones"
                  bgColor="#a9cee980"
                  borderColor="#A9CEE9"
                />
                <Legend
                  text="Virtual Wall"
                  bgColor="#3e516c80"
                  borderColor="#3E516C"
                />
              </div>
              <div className="hidden flex-wrap justify-center items-center w-full mt-auto space-x-10 my-10">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/assets/icons/icon_starting.svg"
                    className="cursor-pointer"
                    width={20}
                    height={20}
                    alt=""
                  />
                  <div
                    className={`text-sm text-black-1 h-[15px] justify-center items-center flex w-full ${FontHind.className}`}
                  >
                    Show Zones
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="/assets/icons/icon_docking.svg"
                    className="cursor-pointer"
                    width={20}
                    height={20}
                    alt=""
                  />
                  <div
                    className={`text-sm text-black-1 h-[15px] justify-center items-center flex w-full ${FontHind.className}`}
                  >
                    Docking Point
                  </div>
                </div>
              </div>
              {/* <div className="flex flex-wrap justify-center items-center w-full mt-auto space-x-10 my-5">
                <ChecboxInput
                  label="Show Zones"
                  name="keep_password"
                  register={register}
                  control={control}
                  color="text-black-1"
                />
                <ChecboxInput
                  label="Show Cleanable Areas"
                  name="keep_password"
                  register={register}
                  control={control}
                  color="text-black-1"
                />
              </div> */}
            </div>
            <div className=" p-2 md:p-5 grid grid-cols-2 gap-10">
              <div className="space-y-2.5">
                <div className="text-blue-2 font-semibold">General</div>
                <RowDetail
                  title={<span className="font-semibold">Plan Type</span>}
                  info="Cleaning"
                />
                <RowDetail
                  title={<span className="font-semibold">Last Modified</span>}
                  info={moment(
                    new Date(location?.last_updated?.slice(0, -1))
                  ).format("DD/MM/YYYY HH:mm:ss")}
                />
              </div>
              {/* <div className="space-y-2.5">
                <div className="text-blue-2 font-semibold">Plan Target</div>
                <RowDetail
                  title={
                    <span className="text-green-1 font-semibold">Success</span>
                  }
                  info={
                    <div>
                      -
                    </div>
                  }
                />
                <RowDetail
                  title={
                    <span className="text-yellow-1 font-semibold">Partial</span>
                  }
                  info={
                    <div>
                      -
                    </div>
                  }
                />
              </div> */}
              {/* <div className="space-y-2.5">
                <div className="text-blue-2 font-semibold">Performance</div>
                <div
                  className={`w-full flex flex-col text-sm text-black-1 ${FontHind.className}`}
                >
                  <span>-</span>
                  <div className="w-full my-2 bg-yellow-1 rounded-full">
                    <div className="w-[0%] h-[20px] bg-green-1 rounded-full"></div>
                  </div>
                  <div className="w-full flex justify-between">
                    <span className="text-green-1 font-semibold">
                      -% Success
                    </span>
                    <span className="text-yellow-1 font-semibold">
                      -% Partial
                    </span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className=" w-full md:max-w-[280px]">
            <div className="bg-white-1 w-full rounded-[10px]">
              <div className="w-full flex h-[50px]">
                <div
                  onClick={() => setTab(TAB.CLEANING_PLAN)}
                  className={`${
                    tab === TAB.CLEANING_PLAN
                      ? "bg-blue-2 text-white"
                      : "bg-transparent text-blue-2"
                  } cursor-pointer hover:bg-blue-2 hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconCleaningPlan />
                </div>
                <div
                  onClick={() => setTab(TAB.ROBOT)}
                  className={`${
                    tab === TAB.ROBOT
                      ? "bg-blue-2 text-white"
                      : "bg-transparent text-blue-2"
                  } cursor-pointer hover:bg-blue-2 hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconRobot />
                </div>
                {/* <div
                  onClick={() => setTab(TAB.BOOK_LEGEND)}
                  className={`${
                    tab === TAB.BOOK_LEGEND
                      ? "bg-blue-2 text-white"
                      : "bg-transparent text-blue-2"
                  } cursor-pointer hover:bg-blue-2 hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconBookLegend />
                </div> */}
                <div
                  onClick={() => setTab(TAB.REPORT)}
                  className={`${
                    tab === TAB.REPORT
                      ? "bg-blue-2 text-white"
                      : "bg-transparent text-blue-2"
                  } cursor-pointer hover:bg-blue-2 hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconReports />
                </div>
              </div>

              {/* TAB CLEANING_PLAN */}
              {tab === TAB.CLEANING_PLAN && (
                <div className="bg-white p-4">
                  <div className="space-y-2">
                    {/* <SelectInput
                      label="Cleaning Plan"
                      register={register}
                      name="organization"
                      placeholder="Select Cleaning Plan"
                      control={control}
                      options={[]}
                      otherInfo="Manage Cleaning Plan"
                      actionOtherInfo={() => setOpenManageCleaningPlan(true)}
                    /> */}

                    {/* <ChecboxInput
                      label="Use this as default cleaning plan"
                      name="keep_password"
                      register={register}
                      control={control}
                      color="text-black-1"
                    /> */}

                    {/* <div className="pt-0">
                      <label className="text-sm text-blue-2 font-semibold mb-2.5">
                        Selected Zone(s)
                      </label>
                      <div className="flex flex-col space-y-2.5 max-h-[50vh] overflow-y-auto">
                        {zone?.map((item, key) => {
                          return <CardZone key={key} item={item} />;
                        })}
                      </div>
                    </div> */}
                  </div>
                </div>
              )}

              {/* TAB ROBOT */}
              {tab === TAB.ROBOT && (
                <div className="bg-white p-4 ">
                  {/* <div className={`mb-2.5 text-sm ${FontHind.className}`}>
                    Assign robot(s) to the building
                  </div>
                  <div className="my-2.5">
                    <SearchInput
                      register={register}
                      name="search"
                      placeholder="Search Robot"
                      isInvalid={errors.search}
                      color={"text-white"}
                    />
                  </div> */}
                  {/*<div className="flex py-1.5 h-[45px] item-center space-x-2.5">
                    <button  type="button" className="text-xs text-white bg-blue-2 rounded-full py-2 px-4">
                      All
                    </button>

                    <button type="button" className="text-xs text-blue-2 bg-white-1 rounded-full py-2 px-4">
                      Base
                    </button>

                    <button type="button" className="text-xs text-blue-2 bg-white-1 rounded-full py-2 px-4">
                      Module
                    </button>
                  </div>*/}
                  {/* <div className="mt-2 space-y-2.5">
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
                  </div> */}
                </div>
              )}

              {/* TAB BOOK_LEGEND */}
              {/* {tab === TAB.BOOK_LEGEND && (
                <div className="bg-white p-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-3">
                      <Image
                        src="/assets/icons/icon_elevator.svg"
                        className="cursor-pointer"
                        width={40}
                        height={40}
                        alt=""
                      />
                      <div className={`${FontHind.className}`}>Elevator</div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Image
                        src="/assets/icons/icon_staircase.svg"
                        className="cursor-pointer"
                        width={40}
                        height={40}
                        alt=""
                      />
                      <div className={`${FontHind.className}`}>Staircase</div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Image
                        src="/assets/icons/icon_escalator.svg"
                        className="cursor-pointer"
                        width={40}
                        height={40}
                        alt=""
                      />
                      <div className={`${FontHind.className}`}>Escalator</div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Image
                        src="/assets/icons/icon_sliding_door.svg"
                        className="cursor-pointer"
                        width={40}
                        height={40}
                        alt=""
                      />
                      <div className={`${FontHind.className}`}>
                        Sliding Door
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

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
                  </div>
                  <div className={`mt-6 text-sm ${FontHind.className}`}>
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
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </Page>
    </>
  );
};

export default LocationDetailView;
