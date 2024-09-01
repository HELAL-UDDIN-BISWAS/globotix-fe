"use client";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import LoadingScreen from "@/components/features/accounts/view/loadingScreen";
import { FontHind } from "@/components/fonts";
import Page from "@/components/layout/page";
import api from "@/utils/api.axios";
import {
  formatIsoDate,
  getRandomInt,
  RangeColor,
  RangeColorStatus,
  CleaningStatus,
} from "@/utils/helper";

import ButtonDownloadPDFReport from "../download-pdf.button";
import apolloClient from "@/lib/apolloClient";
import { GET_ALL_REPORTS } from "@/graphql/queries/reports";
import { FaChevronLeft } from "react-icons/fa";
import useRobotsList from "@/hooks/useRobotsList";
import LoadingScreenPage from "@/components/features/accounts/view/loadingScreen";
import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
import { intervalToDuration } from "date-fns";
import useReports from "@/hooks/useReports";
import avatar from "/public/upload/images/no_result.png";
import ReportStatus from "./ReportStatus";
const socket = io(API_URL, { transport: ["websocket"] });

const RowSummary = (props) => {
  return (
    <div className={`flex w-full justify-between  text-sm`}>
      <span className="font-semibold">{props.area}:</span>
      <span className="w-full text-right">
        {props.repetition} {parseInt(props.repetition) ? "rounds" : ""}
      </span>
    </div>
  );
};

const RowDetail = (props) => {
  return (
    <div
      className={`w-full grid grid-cols-2 gap-2.5 text-base font-medium ${FontHind.className}`}
    >
      <div className="flex justify-between text-secondaryFontColor">
        <span>{props.title}</span>
        <span>:</span>
      </div>
      <span className="break-words text-bodyTextColor">{props.info}</span>
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
      <span
        className={` ${
          props.active ? "font-bold" : ""
        } text-xs text-black-1 h-[15px] justify-center items-center flex w-full}`}
      >
        {props.text}
      </span>
    </div>
  );
};

const CardCleaningConfiguration = (props) => {
  const data = props.data;

  const arrLoc = ["Hard Floor", "Carpet", "Custom"];

  return (
    <div className="border border-white-1 rounded-[10px]">
      <div className="flex flex-col pt-4 px-2 pb-2.5">
        <label className="text-sm text-primary font-semibold mb-[6px]">
          {data.name} ({data.repetition || "Skipped"})
        </label>
        <div className="flex w-full justify-between text-sm">
          <span className="text-primary">
            {arrLoc[getRandomInt(arrLoc.length)]}
          </span>
          <span
            style={{
              color: data?.true_cleaning_percentage
                ? RangeColor(
                    parseFloat(data?.true_cleaning_percentage)?.toFixed(2)
                  )
                : "#333333",
            }}
          >
            {data?.true_cleaning_percentage
              ? data?.true_cleaning_percentage?.toFixed(2) + "%"
              : "Skipped"}
          </span>
        </div>
      </div>
      <div class="flex space-x-2.5 py-2 px-2.5 bg-primary rounded-b-[10px]">
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
      </div>
    </div>
  );
};

const formatDuration = (seconds) => {
  if (seconds === undefined || seconds === null || isNaN(seconds)) {
    return "-";
  }
  seconds = Math.abs(parseInt(seconds, 10));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = "";
  if (days >= 7) {
    result = `${days} day${days !== 1 ? "s" : ""}`;
  } else if (days >= 1) {
    result = `${days} day${days !== 1 ? "s" : ""} ${hours} hour${
      hours !== 1 ? "s" : ""
    }`;
  } else {
    if (hours > 0) {
      result += `${hours} hour${hours !== 1 ? "s" : ""} `;
    }
    if (minutes > 0) {
      result += `${minutes} min${minutes !== 1 ? "s" : ""} `;
    }
    if (remainingSeconds > 0 || result === "") {
      result += `${remainingSeconds} sec${remainingSeconds !== 1 ? "s" : ""}`;
    }
  }
  return result.trim();
};

const ReportDetailView = () => {
  const router = useRouter();
  const params = useParams();
  const [dataDetail, setDataDetail] = useState({});
  const [zones, setZones] = useState([]);
  const [skippedZones, setSkippedZones] = useState([]);
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  const robots = useRobotsList();
  const reports = useReports();
  socket.on("robot-flexadev-queue", (arg) => {
    if (arg.table_name === "robot") {
      robots.fetchData();
    }
  });

  useEffect(() => {
    robots.fetchData();
  }, []);

  const getBaseName = (val) => {
    let rbt = robots?.data?.find((item) => val === item.attributes.baseName);

    return rbt?.attributes.displayName || "";
  };

  // const fetchData = useCallback(async () => {
  // 	try {
  // 		setLoading(true);
  // 		const response = await api.get("/cleaning_reports/" + params?.reportId);

  // 		if (response?.status === 200) {
  // 			setDataDetail(response.data);
  // 			// setSkippedZones(response.data.skipped_zones || null);
  // 			setImgSrc({
  // 				name: "cleaning_zones_img_url",
  // 				img: response.data.complete_img_url || "",
  // 			});
  // 			handleSetZones(response);
  // 			setLoading(false);
  // 		}
  // 	} catch (error) {
  // 		console.log("error", error);
  // 		setLoading(false);
  // 	}
  // }, [params?.reportId]);
  useEffect(() => {
    const filter = {
      report_id: params?.reportId,
    };
    reports.fetchData(filter);
  }, [params?.reportId]);
  useEffect(() => {
    if (reports?.data) {
      setReportData(reports?.data || []);
    }
  }, [reports?.data]);

  const fetchData = useCallback(async () => {
    const response = await apolloClient.query({
      query: GET_ALL_REPORTS,
      fetchPolicy: "network-only",
      variables: {
        filters: {
          id: { eq: params?.reportId },
        },
      },
    });

    if (response?.data?.reports?.data.length === 1) {
      setDataDetail(response?.data?.reports?.data[0]);
      // setSkippedZones(response.data.data.skipped_zones || null);
      setImgSrc({
        name: "cleaning_zones_img_url",
        img:
          response.data?.reports?.data?.[0]?.attributes?.completeImage?.data
            ?.attributes?.url || "",
      });
      handleSetZones(response);
    }
  }, [params?.reportId]);
  // console.log("detail data", dataDetail);
  const handleSetZones = (response) => {
    let arr = [
      ...(response?.data?.reports?.data?.[0]?.attributes?.cleaningZones || []),
    ];
    arr.sort((a, b) => a.order - b.order);
    setZones(arr || []);
  };

  const getStartTime = useCallback(() => {
    const dateString = dataDetail?.attributes?.startIso8601Time;
    if (!dateString) return "";
    const date = moment(dateString);
    if (date?.isValid()) {
      return (
        <div className="flex space-x-2">
          <span>{date?.format("DD/MM/YYYY HH:mm:ss")}</span>
        </div>
      );
    } else {
      return "-";
    }
  }, [dataDetail?.attributes?.startIso8601Time]);
  const getEndTime = useCallback(() => {
    const dateString = dataDetail?.attributes?.endIso8601Time;
    if (!dateString) return "";
    const date = moment(dateString);
    if (date?.isValid()) {
      return (
        <div className="flex space-x-2">
          <span>{date?.format("DD/MM/YYYY HH:mm:ss")}</span>
        </div>
      );
    } else {
      return "-";
    }
  }, [dataDetail?.attributes?.endIso8601Time]);
  const getDuration = useCallback(() => {
    const duration = moment.duration(
      moment(dataDetail?.attributes?.endIso8601Time).diff(
        moment(dataDetail?.attributes?.startIso8601Time)
      )
    );
    if (isNaN(duration)) {
      return "-";
    }
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return `${hours} hour ${minutes} min ${seconds} sec` || "-";
  }, [
    dataDetail?.attributes?.startIso8601Time,
    dataDetail?.attributes?.endIso8601Time,
  ]);
  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  const calcEfficiency = (obj) => {
    let hms = obj?.attributes?.cleaningDuration;
    if (hms) {
      let arrTime = hms.split(":");
      let seconds =
        parseInt(arrTime[0]) * 3600 +
        parseInt(arrTime[1]) * 60 +
        parseInt(arrTime[2]);

      let ret = parseFloat(
        (obj?.attributes?.cleanedArea / seconds) * 3600
      )?.toFixed(2);
      return ret;
    } else {
      return "";
    }
  };

  const cleaningConfiguration = [
    {
      area: "Zone 1 (1)",
      location: "Carpet",
      percent: 70,
      speed: "Slow",
      eco: "Eco",
      brush: "Normal",
    },
    {
      area: "Zone 2 (1)",
      location: "Hard Floor",
      percent: 70,
      speed: "Slow",
      eco: "Eco",
      brush: "Normal",
    },
    {
      area: "Zone 1 (2)",
      location: "Custom",
      percent: 90,
      speed: "Slow",
      eco: "Eco",
      brush: "Normal",
    },
    {
      area: "Zone 2 (2)",
      location: "Custom",
      percent: 90,
      speed: "Slow",
      eco: "Eco",
      brush: "Normal",
    },
  ];

  const onClickLegend = (name, img) => {
    setImgSrc({
      name: name,
      img: img,
    });
  };

  const secondsToHms = (seconds) => {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);

    // Add leading zeros if necessary
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    return h + ":" + m + ":" + s;
  };

  return (
    <>
      <Page
        title={
          loading ? (
            ""
          ) : (
            <div className="flex items-center gap-4">
              <FaChevronLeft
                color="primary"
                className="cursor-pointer"
                onClick={() => router?.push("/reports")}
              />
              <div className="flex flex-col md:flex-row md:justify-center md:items-center">
                <div>
                  {dataDetail?.attributes?.robot?.data?.attributes
                    ?.displayName || ""}
                </div>
                <div className="flex font-normal text-xs md:ml-1 md:text-base">
                  ({getStartTime()})
                </div>
              </div>
            </div>
          )
        }
        header={<ButtonDownloadPDFReport dataDetail={dataDetail} />}
      >
        {loading ? (
          <LoadingScreenPage />
        ) : (
          <div
            id="divReportDetail"
            className="flex px-2 md:px-5 gap-5 w-full h-full"
          >
            <div className="flex flex-col w-[70%] h-full gap-4">
              {/* <div className=" px-2 md:px-5  hidden flex-none flex-col w-full md:w-[280px] h-full bg-white  text-primary rounded-[10px] p-4">
              <div className="flex flex-col">
                <label className="text-sm text-primary font-semibold mb-2.5">
                  Summary
                </label>
                <div className="flex flex-col space-y-1.5">
                  {zones.map((item, index) => (
                    <RowSummary
                      key={index}
                      area={item.name}
                      repetition={item.repetition || "Skipped"}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col mt-[30px]">
                <label className="text-sm text-primary font-semibold mb-2.5">
                  Cleaning Configuration
                </label>
                <div className="flex flex-col space-y-1.5">
                  {zones.map((item, index) => (
                    <CardCleaningConfiguration key={index} data={item} />
                  ))}
                </div>
              </div>
            </div> */}
              <div
                id="divAreaImage"
                className="w-full relative overflow-hidden flex justify-center items-center"
              >
                <Image
                  src={
                    imgSrc?.img
                      ? `${process.env.NEXT_PUBLIC_API_URL}${imgSrc?.img}`
                      : ""
                  }
                  quality={100}
                  width={873}
                  height={544}
                  className="h-auto w-auto object-none"
                  alt=""
                />
              </div>
              <div className="">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="rounded-[10px] px-4 py-4 border border-[#9EA1A5] bg-white"
                    style={
                      {
                        // boxShadow: "0px 2px 20px 0px rgba(158, 161, 165, 0.22)",
                      }
                    }
                  >
                    <label className="text-[#7E6E3C] text-[16px] font-semibold">
                      Report Information
                    </label>
                    <div className="flex flex-col space-y-2.5 mt-[15px]">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Robot
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            <Link href={"/robots"}>
                              {dataDetail?.attributes?.robot?.data?.attributes
                                ?.displayName || "-"}
                            </Link>
                          </p>
                        </div>

                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Operator-In-Charge
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {dataDetail?.attributes?.operatorName || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Location
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            <Link href={"/location"}>
                              {dataDetail?.attributes?.location?.data
                                ?.attributes?.name || "-"}
                            </Link>
                          </p>
                        </div>
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Start Time
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {getStartTime()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Cleaning Plan
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {dataDetail?.attributes?.location?.data?.attributes
                              ?.building?.data?.attributes?.name || "-"}
                          </p>
                        </div>
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            End Time
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {getEndTime()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-[10px] px-4 py-4 border border-[#9EA1A5] bg-white"
                    style={
                      {
                        // boxShadow: "0px 2px 20px 0px rgba(158, 161, 165, 0.22)",
                      }
                    }
                  >
                    <label className="text-[#7E6E3C] text-[16px] font-semibold">
                      Performance
                    </label>
                    <div className="flex flex-col space-y-2.5 mt-[15px]">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Cleaning Status
                          </p>
                          <p
                            className="text-[#0A8217] text-[16px] font-medium"
                            style={{
                              color: CleaningStatus(
                                dataDetail?.attributes?.cleaningStatus
                              ).color,
                            }}
                          >
                            <span className={`font-semibold`}>
                              {
                                CleaningStatus(
                                  dataDetail?.attributes?.cleaningStatus
                                ).text
                              }
                            </span>
                          </p>
                        </div>
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Time Taken
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {getDuration()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Total Area
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {dataDetail?.attributes?.totalArea
                              ? parseFloat(
                                  dataDetail?.attributes?.totalArea
                                ).toFixed(2) + " m2"
                              : "-"}
                          </p>
                        </div>
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Cleaned Area
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {dataDetail?.attributes?.cleanedArea
                              ? parseFloat(
                                  dataDetail?.attributes?.cleanedArea
                                ).toFixed(2) + " m2"
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Uncleaned Area
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {dataDetail?.attributes?.missedCleaningArea
                              ? parseFloat(
                                  dataDetail?.attributes?.missedCleaningArea
                                ).toFixed(2) + " m2"
                              : "-"}
                          </p>
                        </div>
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Productivity
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {calcEfficiency(dataDetail) + " m2/hour"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Coverage
                          </p>
                          <p
                            className="text-[#0A8217] text-[16px] font-medium"
                            style={{
                              color: RangeColor(
                                parseFloat(
                                  dataDetail?.attributes?.coveragePercentage
                                )
                              ),
                            }}
                          >
                            {parseFloat(
                              dataDetail?.attributes?.coveragePercentage
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                        <div className="">
                          <p className="text-[#667085] text-[14px] font-normal">
                            Battery Usage
                          </p>
                          <p className="text-[#344054] text-[16px] font-medium">
                            {dataDetail?.attributes?.batteryUsage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[30%] h-full flex flex-col gap-4">
              <ReportStatus />
              <div
                className="rounded-[10px] px-4 py-4 border border-[#9EA1A5] flex-1 min-h-0 bg-white"
                style={
                  {
                    // boxShadow: "0px 2px 20px 0px rgba(158, 161, 165, 0.22)",
                  }
                }
              >
                <label className="text-[#7E6E3C] text-[16px] font-semibold">
                  Component Health
                </label>
                <div className="flex flex-col space-y-2.5 mt-[15px]">
                  <div>
                    <h6 className="text-[#667085] text-[16px] font-medium">
                      Roller Brush
                    </h6>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="">
                        <p className="text-[#667085] text-[14px] font-normal">
                          Usage
                        </p>
                        <p className="text-[#344054] text-[16px] font-medium">
                          {formatDuration(
                            dataDetail?.attributes?.rollerTimeUsage || null
                          )}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-[#667085] text-[14px] font-normal">
                          Remaining Time
                        </p>
                        <p className="text-[#344054] text-[16px] font-medium">
                          {formatDuration(
                            dataDetail?.attributes?.rollerLifespanRemaining ||
                              null
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-[#667085] text-[16px] font-medium">
                      Gutter Brush
                    </h6>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="">
                        <p className="text-[#667085] text-[14px] font-normal">
                          Usage
                        </p>
                        <p className="text-[#344054] text-[16px] font-medium">
                          {formatDuration(
                            dataDetail?.attributes?.gutterTimeUsage || null
                          )}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-[#667085] text-[14px] font-normal">
                          Remaining Time
                        </p>
                        <p className="text-[#344054] text-[16px] font-medium">
                          {formatDuration(
                            dataDetail?.attributes?.gutterLifespanRemaining ||
                              null
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-[#667085] text-[16px] font-medium">
                      Pre-filter (vacuum)
                    </h6>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="">
                        <p className="text-[#667085] text-[14px] font-normal">
                          Usage
                        </p>
                        <p className="text-[#344054] text-[16px] font-medium">
                          {formatDuration(
                            dataDetail?.attributes?.prefilterTimeUsage || null
                          )}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-[#667085] text-[14px] font-normal">
                          Remaining Time
                        </p>
                        <p className="text-[#344054] text-[16px] font-medium">
                          {formatDuration(
                            dataDetail?.attributes
                              ?.prefilterLifespanRemaining || null
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="text-[#667085] text-[16px] font-medium">
                      HAPA filter (vacuum)
                    </h6>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="">
                        <p className="text-[#667085] text-[14px] font-normal">
                          Usage
                        </p>
                        <p className="text-[#344054] text-[16px] font-medium">
                          {formatDuration(
                            dataDetail?.attributes?.hepafilterTimeUsage || null
                          )}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-[#667085] text-[14px] font-normal">
                          Remaining Time
                        </p>
                        <p className="text-[#344054] text-[16px] font-medium">
                          {formatDuration(
                            dataDetail?.attributes
                              ?.hepafilterLifespanRemaining || null
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="rounded-[10px] border border-[#9EA1A5] px-4 py-4 bg-white flex-1"
                style={
                  {
                    // boxShadow: "0px 2px 20px 0px rgba(158, 161, 165, 0.22)",
                  }
                }
              >
                <label className="text-[#7E6E3C] text-[16px] font-semibold">
                  Zone Coverage
                </label>
                <div className="flex flex-col space-y-2.5 mt-[15px]">
                  <div className="w-full grid grid-cols-2 gap-2.5 ">
                    <div></div>
                    <div className="grid grid-cols-2 gap-2.5 text-titleFontColor font-medium">
                      <div>Coverage</div>
                      <div>Time Taken</div>
                    </div>
                  </div>
                  {zones?.map((item, key) => {
                    return (
                      <RowDetail
                        key={key}
                        title={item?.name}
                        info={
                          <div className="grid grid-cols-2">
                            <span
                              style={{
                                color: item?.true_cleaning_percentage
                                  ? RangeColor(
                                      parseFloat(
                                        item?.true_cleaning_percentage
                                      )?.toFixed(2)
                                    )
                                  : "#333333",
                              }}
                            >
                              {item?.true_cleaning_percentage
                                ? item?.true_cleaning_percentage?.toFixed(2) +
                                  "%"
                                : "Skipped"}
                            </span>
                            <span className="text-bodyTextColor ml-3">
                              {item?.zone_duration_info?.time_spent_inside_zone
                                ? secondsToHms(
                                    item?.zone_duration_info
                                      ?.time_spent_inside_zone
                                  )
                                : "-"}
                            </span>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </Page>
    </>
  );
};

export default ReportDetailView;
