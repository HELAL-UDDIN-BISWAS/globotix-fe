"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import Image from "next/image";
import Page from "@/components/layout/page";
import { createColumnHelper } from "@tanstack/react-table";
import { GoPencil } from "react-icons/go";
import { useRouter } from "next/navigation";
import Button from "@/components/common/button";
import ButtonGroup from "@/components/common/buttonGroup";
import { IoMdAdd } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { IoPlayCircleOutline } from "react-icons/io5";
import BotBaseBatteryHealth from "./bot-base-batteryHealth";
import BotBaseCoveragePerformance from "./bot-base-coverage-performance";
import useRobots from "@/hooks/useRobots";
import useReports from "@/hooks/useReports";
import BatteryIcon0 from "/public/upload/icons/table_battery0.svg";
import BatteryIcon20 from "/public/upload/icons/table_battery20.svg";
import BatteryIcon40 from "/public/upload/icons/table_battery40.svg";
import BatteryIcon60 from "/public/upload/icons/table_battery60.svg";
import BatteryIcon80 from "/public/upload/icons/table_battery80.svg";
import BatteryIcon100 from "/public/upload/icons/table_battery100.svg";
import { RangeColor, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";
import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";
import BotBaseIssueFaced from "./bot-base-issueFaced";
import BotBaseDetailEdit from "../edit/bot-base-detail.edit";
import ViewallActivitylog from "./viewall.activitylog";
import Table from "@/components/common/table/table";
import useAuth from "@/hooks/useAuth";
import ActionMenu from "@/components/share/dropdown/actionMenu";
import FourCameraView from "../botStream/fourCameraView";

const BotDetail = ({ robot }) => (
  <CardComponent title="Bot Detail">
    <CardItem title="Name" value={robot?.displayName} />
    <CardItem title="ID" value={robot?.serialNumber} />
    <CardItem title="Assigned Site" value={robot?.building?.name} />
    <BotBaseDetailEdit />
  </CardComponent>
);

const CurrentActivity = ({ robot, report }) => {
  const [activity, setActivity] = useState({
    status: robot?.status,
    batteryLevel: robot?.batteryPercentage || 0,
    map: null,
  });

  useEffect(() => {
    setActivity((prev) => ({
      ...prev,
      status: robot?.status,
      batteryLevel: robot?.batteryPercentage || 0,
    }));

    if (robot?.status === "Cleaning" && report?.length) {
      const latestReport = report.reduce((latest, current) =>
        new Date(current?.updatedAt) > new Date(latest?.updatedAt)
          ? current
          : latest
      );
      setActivity((prev) => ({
        ...prev,
        map: latestReport?.attributes?.completeImage?.data?.attributes?.url,
      }));
    }
  }, [robot, report]);

  return (
    <CardComponent title="Current Activity">
      <CardItem title="Status" value={activity?.status} />
      <CardItem
        title="Battery Level"
        value={
          <div className="flex items-center gap-1">
            <span style={{ color: RangeColor(activity.batteryLevel) }}>
              {activity.batteryLevel}%
            </span>
            <Image
              alt="Battery status"
              src={batteryIndicator(activity.batteryLevel)}
              height={32}
              width={32}
            />
          </div>
        }
      />
      {/* <CardItem title="Current Schedule" value="Morning Plan" /> */}
      {activity.map && (
        <>
          <hr className="-mx-[20px] text-primary" />
          <Image
            alt="Map of Cleaning-Plan"
            src={activity.map}
            height={170}
            width={151}
          />
        </>
      )}
    </CardComponent>
  );
};

const BotBaseDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getRobotById, robot } = useRobots((state) => state);
  const { data: reportData, fetchData: fetchReports } = useReports();
  const [viewOption, setViewOption] = useState("Performence");
  const columnHelper = createColumnHelper();
  const [sorting, setSorting] = useState([{ id: "name", desc: false }]);
  const [isCameraView, setIsCameraView] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    zone: ["All Zone"],
    performance: ["Coverage", "Productivity"],
  });
  const [filters, setFilters] = useState({
    zone: filterOptions.zone[0],
    performance: filterOptions.performance[1],
  });

  const fetchData = useCallback(async () => {
    await getRobotById({ id: params.robotId });

    const filter = {
      robot_id: +params.robotId,
    };
    await fetchReports("", filter, "", "");
  }, [params.robotId]);

  const schedulesList = !!robot
    ? robot?.cleaningPlanEditors
        ?.map((eachPlan) => {
          return eachPlan.schedules.data;
        })
        .flat()
    : null;

  useEffect(() => {
    fetchData().catch(console.error());
  }, [fetchData]);

  // socket.on("robot-flexadev-queue", (arg) => {
  //   if (arg.table_name === "robot") {
  //     fetchRobot();
  //     fetchReports();
  //   }
  // });
  console.log("robot...", robot);
  console.log("schedule...", schedulesList);
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: () => null,
      cell: (info) => null,
      enableSorting: false,
    }),

    columnHelper.accessor("checkbox", {
      id: "checkbox",
      header: () => {
        if (isOnlyAdmin(user?.role)) {
          return (
            <div className="flex justify-center items-center">
              <input
                type="checkbox"
                // checked={allCheck}
                className={"cursor-pointer rounded-2xl"}
                onChange={(e) => {
                  onAllCheck(e);
                }}
              />
            </div>
          );
        }
      },
      cell: (info) => {
        if (isOnlyAdmin(user?.role)) {
          return (
            <div className="flex justify-center items-center">
              <input
                type="checkbox"
                // checked={info.row.original.checked}
                className={"cursor-pointer rounded-2xl"}
                onChange={(e) => {
                  // onSingleCheck(e, info.row.original);
                }}
              />
            </div>
          );
        }
      },
      enableSorting: false,
    }),

    columnHelper.accessor("attributes.name", {
      id: "name",
      header: () => {
        // let isSort = sorting?.length > 0 && sorting[0]?.id == "attributes_name";
        // let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Schedule Name</span>
            {/* <IconSort isSort={isSort} isDesc={isDesc} /> */}
          </div>
        );
      },
      cell: (info) => (
        <Link href="">
          <span
            className="text-hyperLinkColor cursor-pointer"
            // onClick={() => console.log("robot", info?.row.original?.id)}
          >
            {info?.getValue()}
          </span>
        </Link>
      ),
    }),

    columnHelper.accessor("attributes.cleaningDate", {
      id: "cleaningDate",
      header: () => {
        // let isSort =
        //   sorting?.length > 0 && sorting[0]?.id == "attributes_serialNumber";
        // let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span>ID</span>

            {/* <IconSort isSort={isSort} isDesc={isDesc} /> */}
          </div>
        );
      },

      cell: (info) => <span>{info.getValue() || "-"}</span>,
    }),

    columnHelper.accessor("", {
      id: "duration",
      header: () => {
        // let isSort = sorting?.length > 0 && sorting[0]?.id == "buildingName";
        // let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Duration</span>
            {/* <IconSort isSort={isSort} isDesc={isDesc} /> */}
          </div>
        );
      },
      cell: (info) => "30 mins",
      // info?.getValue(),
      enableSorting: true,
    }),

    columnHelper.accessor("", {
      id: "records",
      header: () => {
        // let isSort =
        //   sorting?.length > 0 && sorting[0]?.id == "attributes_workingStatus";
        // let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Records</span>

            {/* <IconSort isSort={isSort} isDesc={isDesc} /> */}
          </div>
        );
      },
      cell: (info) => (
        <div onClick={() => setIsCameraView(!isCameraView)}>
          {" "}
          <IoPlayCircleOutline
            className="text-hyperLinkColor cursor-pointer"
            size={30}
            // color={"blue"}
          />
        </div>
      ),
    }),

    columnHelper.accessor("attributes.cleaningPlanEditor.data.id", {
      id: "action",
      header: () => (
        <div className="w-[100px] flex  items-center text-center">
          {isSuperAdmin(user?.role) && checkSelected() ? (
            <ButtonIcon
              isHover
              onClick={() =>
                onBulkDelete(
                  tableData
                    .filter((item) => item.checked === true)
                    .map((item) => item.id)
                )
              }
              icon={<IconTrash />}
              label="Delete Selected"
            />
          ) : (
            // <RiDeleteBin6Line />
            <></>
          )}
        </div>
      ),
      cell: (info) => {
        console.log("route id", info.row);
        return (
          <ActionMenu
            view
            onViewClick={() => {
              // setViewedItem(info.row.original);
              // setDetailOpen(true);
              // router.push(`/robots/base/${info.row.original?.id}`);
              router.push(`/robots/route/${info?.getValue()}`);
            }}
          />
        );
      },
    }),
  ];
  return (
    <Page
      title={
        <div className="flex gap-1 items-center text-xl font-semibold text-titleFontColor">
          <Link href="/robots" className="text-hyperLinkColor">
            Bots
          </Link>
          <MdArrowForwardIos />
          <span>{robot?.displayName}</span>
        </div>
      }
      noti={true}
    >
      <div className="mt-[116px] flex flex-col lg:flex-row gap-4 px-5">
        <div className="md:min-w-[308px] flex flex-col md:flex-row lg:flex-col gap-4">
          <BotDetail robot={robot} />
          <CurrentActivity robot={robot} report={reportData} />
        </div>
        <div className="grow flex flex-col gap-4">
          {/* <div className="flex md:flex-row flex-col gap-1 md:ml-auto">
            <ButtonGroup
              optionOne={"Performence"}
              optionTwo={"Cleaning Plan"}
              optionThree={"Cleaning History"}
              onChange={(option) => setViewOption(option)}
            /> */}
          {/* <div className="md">
              <Button
                onClick={() => {
                  router.push(
                    `/robots/route/plan-monitoring/${params.robotId}`
                  );
                }}
              >
                <span className="flex items-center gap-1 text-white">
                  Past Streaming
                </span>
              </Button>
            </div>
            <div className="md">
              <Button
                onClick={() => {
                  router.push(
                    `/robots/route/live-monitoring/${params.robotId}`
                  );
                }}
              >
                <span className="flex items-center gap-1 text-white">
                  Live Monitoring
                </span>
              </Button>
            </div> */}
          {/* <div className="md">
              <Button>
                <span className="flex items-center gap-1 text-white">
                  <IoMdAdd /> Add Plan
                </span>
              </Button>
            </div>
          </div>  */}
          {/* {viewOption === "Performence" ? ( */}
          <>
            <div className="flex xl:flex-row flex-col gap-4">
              <CardComponent
                title={
                  filters.performance === filterOptions.performance[0]
                    ? "Coverage Performance (Daily)"
                    : "Productivity (Daily)"
                }
                style={"grow xl:w-[500px] min-h-[400px] "}
              >
                <BotBaseCoveragePerformance
                  filterOptions={filterOptions}
                  setFilterOptions={setFilterOptions}
                  filters={filters}
                  setFilters={setFilters}
                />
              </CardComponent>
              {/* <CardComponent
                    title={
                      <div className="flex items-center gap-1 md:min-w-[300px]">
                        <span>Activity Log</span>
                        <ViewallActivitylog reportData={report.data} />
                      </div>
                    }
                    style={"grow lg:grow-0"}
                  >
                    <BotBaseActivityLog reportData={report.data} itemCount={10} />
                  </CardComponent> */}
            </div>
            {/* <div className="flex xl:flex-row flex-col gap-4"> */}
            {/* <CardComponent
                title={"Issues Faced"}
                style={"grow xl:w-[400px] min-h-[400px]"}
              >
                <BotBaseIssueFaced />
              </CardComponent> */}
            {/* <CardComponent
                    title={"Battery Health"}
                    style={"grow xl:w-[400px] min-h-[400px]"}
                  >
                    <BotBaseBatteryHealth />
                  </CardComponent> */}
            {/* </div> */}
          </>
          {/* ) : viewOption === "Cleaning History" ? (
            <>
              <div className="w-full text-sm font-bold">
                <Table
                  columns={columns}
                  data={schedulesList}
                  throwSorting={(e) => setSorting(e)}
                  defaultSorting={sorting}
                  pathDetail={"/robots/base"}
                  columnVisibility={{ id: false }}
                />
              </div>
            </>
          ) : (
            <>
             <div>WIP</div>
                <BotDetailCleaningPlan /> 
            </>
          )} */}
        </div>
        {isCameraView && (
          <FourCameraView
            open={isCameraView}
            onClose={() => setIsCameraView(!isCameraView)}
          />
        )}
      </div>
    </Page>
  );
};

export default BotBaseDetail;

// Helper Components (CardItem and CardComponent)
const CardItem = ({ title, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-secondaryFontColor text-sm">{title}</span>
    <span className="font-bold text-bodyTextColor">{value}</span>
  </div>
);

const CardComponent = ({ title, style, children }) => (
  <div
    className={`flex flex-col grow gap-6 p-6 shadow-card-shadow rounded-[10px] bg-white ${style}`}
  >
    <span className="text-primary font-semibold">{title}</span>
    {children}
  </div>
);

const batteryIndicator = (level) => {
  if (level <= 0) return BatteryIcon0;
  if (level <= 20) return BatteryIcon20;
  if (level <= 40) return BatteryIcon40;
  if (level <= 60) return BatteryIcon60;
  if (level <= 80) return BatteryIcon80;
  return BatteryIcon100;
};
