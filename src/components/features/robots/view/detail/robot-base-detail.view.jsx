import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FontHind } from "@/components/fonts";
import IconCleaningPlan from "@/components/icons/iconCleaningPlan";
import IconEditPencilBox from "@/components/icons/iconEditPencilBox";
import IconReports from "@/components/icons/iconReports";
import Page from "@/components/layout/page";
import useAuth from "@/hooks/useAuth";
import api from "@/utils/api.axios";
import { isAdmin, isSuperAdmin, RangeColor } from "@/utils/helper";

import PreventiveMaintenanceTarget from "../preventiveMaintenanceTarget";
import PreventiveMaintenanceTimer from "../preventiveMaintenanceTimer";

const RowDetail = (props) => {
  return (
    <div className={`w-full flex text-sm text-black-1 ${FontHind.className}`}>
      <span
        className={`font-semibold mr-1 ${
          props.width ? props.width : "w-[120px]"
        }`}
      >
        {props.title}
      </span>
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

const CardUser = (props) => {
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

const RobotbaseDetailView = () => {
  const { user } = useAuth();
  const TAB = {
    BUILDING: "BUILDING",
    REPORT: "REPORT",
    BRUSH: "BRUSH",
  };
  const router = useRouter();
  const [tab, setTab] = useState(TAB.BUILDING);
  const [building, setBuilding] = useState(null);
  const [openPMTimer, setOpenPMTimer] = useState(false);
  const [openPMTarget, setOpenPMTarget] = useState(false);
  const [bases, setBases] = useState(null);

  const fetchData = useCallback(async () => {
    const response = await api.get("/bases/" + router?.query?.slug[0]);

    if (response?.data?.code === 200) {
      setBases(response.data.data);
    }
  }, [router?.query?.slug]);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  const getStatusColor = () => {
    switch (bases?.status?.working_status?.toLowerCase()) {
      case "offline":
        return "bg-red-1";
      case "online":
        return "bg-green-1";
      case "idle":
        return "bg-disable";
      default:
        return "bg-green-1";
    }
  };

  return (
    <>
      <PreventiveMaintenanceTimer
        open={openPMTimer}
        onClose={() => setOpenPMTimer(false)}
      />

      <PreventiveMaintenanceTarget
        open={openPMTarget}
        onClose={() => setOpenPMTarget(false)}
      />

      <Page
        title={
          <div className="flex justify-between items-center space-x-5">
            <label className="text-black-1 bg-gray font-semibold md:text-lg">
              {/* Base Name */}
              {bases?.display_name || "-"}
            </label>
            <div
              className={`${getStatusColor()} rounded-[10px] text-xs text-white px-2.5 py-1.5 flex justify-start items-center`}
            >
              <div className="mr-1 w-2 h-2 bg-white rounded-full"></div>
              {bases?.status?.working_status}
            </div>
            {(isAdmin(user?.role) || isSuperAdmin(user?.role)) && (
              <Link
                href={"/robots/base/edit-display-name/" + bases?.id}
                className="cursor-pointer"
              >
                <IconEditPencilBox />
              </Link>
            )}
            {isSuperAdmin(user?.role) && (
              <Link
                href={"/robots/base/edit/" + bases?.id}
                className="cursor-pointer"
              >
                <Image
                  src="/assets/icons/gear-icon.svg"
                  width={30}
                  height={30}
                  className="object-contain"
                  alt=""
                />
              </Link>
            )}
          </div>
        }
      >
        <div className="space-x-5 px-5 flex flex-col md:flex-row w-full text-black">
          <div className="w-full bg-white rounded-[10px]">
            <div className=" p-2 md:p-5 grid grid-cols-3 gap-5">
              <div className="w-full flex flex-col items-center py-4 border-r">
                <Image
                  src="/assets/icons/icon_battery_blue.svg"
                  width={30}
                  height={30}
                  className="object-contain"
                  alt=""
                />
                <span className="text-xs text-black-1">Battery</span>
                <div
                  className="font-semibold text-xl mt-1"
                  style={{
                    color: RangeColor(
                      bases?.status?.hardware_status?.battery_percentage
                    ),
                  }}
                >
                  {bases?.status?.hardware_status?.battery_percentage || "0"}%
                </div>
              </div>
              {/*<div className="w-full flex flex-col items-center py-4 border-r">
                <Image
                  src="/assets/icons/icon_connected_module.svg"
                  width={30}
                  height={30}
                  className="object-contain"
                  alt=""
                />
                <span className="text-xs text-black-1">Connected Module</span>
                <div className="text-green-1 font-semibold text-xl mt-1">
                  Flexa Vacuum{" "}
                  <span className="text-xs font-normal">(Module_ID)</span>
                </div>
              </div>*/}
              {/*<div className="w-full flex flex-col items-center py-4">
                <Image
                  src="/assets/icons/icon_gutter_brush.svg"
                  width={30}
                  height={30}
                  className="object-contain"
                  alt=""
                />
                <span className="text-xs text-black-1">Gutter Brush</span>
                <div className="text-red-1 font-semibold text-xl mt-1">Bad</div>
              </div>*/}
            </div>
            <div className="p-2 md:p-5 grid grid-cols-3 gap-5">
              <div className="space-y-2.5">
                <div className="text-primary font-semibold">
                  General Information
                </div>
                <RowDetail
                  title="Serial Number:"
                  info={bases?.serial_number || "-"}
                />
                {/* <RowDetail
                  title="Display Name:"
                  info={bases?.base_name || "-"}
                /> */}
                <RowDetail
                  title="Display Name:"
                  info={bases?.display_name || "-"}
                />
                <RowDetail title="Account:" info={bases?.company_name || "-"} />
                <RowDetail
                  title="Location:"
                  info={bases?.location_name || "-"}
                />
                {/* <div>&nbsp;</div> */}

                {/* <div className="text-primary font-semibold mt-4">Status</div>
                <RowDetail title="IP Address:" info="123.123.123.123" />
                <RowDetail title="Time Spent:" info="500h 13’ 12”" />
                <RowDetail title="Time Zone:" info="GMT +08:00" /> */}
              </div>
              {/*<div className="space-y-2.5">
                <div className="text-primary font-semibold">Specification</div>
                <RowDetail title="Model:" info="Flexa Base" />
                <RowDetail title="Hardware Version:" info="xxx.xxx" />
                <RowDetail title="Software Version:" info="xxx.xxx" />
                <RowDetail title="Radio Type:" info="Sierra Mp70" />
              </div>*/}
              {/*<div className="space-y-2.5">
                <div className="text-primary font-semibold">Maintenance</div>
                <RowDetail title="Maintenance Package:" info="Standard" />
                <RowDetail title="In Service Date:" info="20/2/2022" />
                <RowDetail title="Service Expiry Date:" info="20/2/2024" />
                <RowDetail
                  title={
                    <div className="flex flex-wrap">
                      <span>Preventive Maintenance</span>
                      <span className="mr-1">Target:</span>
                      <Image
                        onClick={() => setOpenPMTarget(true)}
                        src="/assets/icons/icon_helper.svg"
                        width={10}
                        height={10}
                        className="cursor-pointer object-contain mb-1"
                        alt=""
                      />
                    </div>
                  }
                  info="450h 0’"
                />

                <RowDetail
                  title={
                    <div className="flex flex-wrap">
                      <span>Preventive Maintenance</span>
                      <span className="mr-1">Timer:</span>
                      <Image
                        onClick={() => setOpenPMTimer(true)}
                        src="/assets/icons/icon_helper.svg"
                        width={10}
                        height={10}
                        className="cursor-pointer object-contain mb-1"
                        alt=""
                      />
                    </div>
                  }
                  info="600h 15’"
                />
              </div>*/}
            </div>
          </div>
          <div className="w-full md:max-w-[280px] hidden">
            <div className="bg-white-1 w-full rounded-[10px]">
              <div className="w-full flex h-[50px]">
                <div
                  onClick={() => setTab(TAB.BUILDING)}
                  className={`${
                    tab === TAB.BUILDING
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary"
                  } cursor-pointer hover:bg-primary hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconCleaningPlan />
                </div>
                <div
                  onClick={() => setTab(TAB.REPORT)}
                  className={`${
                    tab === TAB.REPORT
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary"
                  } cursor-pointer hover:bg-primary hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconReports />
                </div>
                {/*<div
                  onClick={() => setTab(TAB.BRUSH)}
                  className={`${
                    tab === TAB.BRUSH
                      ? "bg-primary text-white"
                      : "bg-transparent text-primary"
                  } cursor-pointer hover:bg-primary hover:text-white rounded-t-[10px] flex justify-center items-center h-full w-[70px]`}
                >
                  <IconBrush />
                </div>*/}
              </div>

              {/* TAB BUILDING */}
              {tab === TAB.BUILDING && (
                <div className="bg-white p-4">
                  <label className="text-primary font-semibold text-sm">
                    Assigned Location(s)
                  </label>
                  <div className="space-y-2.5 mt-3">
                    <CardBuilding title="T3 Departure L1:" info="123 m2" />
                    <CardBuilding title="T3 Departure L1:" info="123 m2" />
                  </div>
                </div>
              )}

              {/* TAB REPORT */}
              {tab === TAB.REPORT && (
                <div className="bg-white p-4">
                  <label className="text-primary font-semibold text-sm">
                    Reports
                  </label>
                  <div className={`text-sm mt-3 ${FontHind.className}`}>
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
                  </div>
                </div>
              )}

              {/* TAB BRUSH */}
              {tab === TAB.BRUSH && (
                <div className="bg-white p-4">
                  <label className="text-primary font-semibold text-sm">
                    Gutter Brush
                  </label>
                  <div
                    className={`flex flex-col mt-3 space-y-2 ${FontHind.className}`}
                  >
                    <div className="flex text-primary font-semibold text-xs">
                      <span className="flex w-20 mr-5">Last Changed:</span>
                      <span>20/2/2022</span>
                    </div>
                    <div className="flex  text-primary font-semibold text-xs">
                      <span className="flex  w-20 mr-5">Next Change:</span>
                      <span>20/2/2023</span>
                    </div>
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

export default RobotbaseDetailView;
