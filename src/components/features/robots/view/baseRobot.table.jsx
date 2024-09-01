import { RangeColor, isAdmin, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ButtonIcon from "@/components/button/icon.button";
import Table from "@/components/common/table/table";
import RobotDetailViewModal from "./detail/robotDetailViewModal";
import EditDisplayNameModal from "./edit/editDisplayNameModal";
import IconTrash from "../../../../../public/upload/icons/iconTrash";
import ActionMenu from "@/components/share/dropdown/actionMenu";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdOutlineCheckBox,
} from "react-icons/md";
import BatteryIcon0 from "/public/upload/icons/table_battery0.svg";
import BatteryIcon20 from "/public/upload/icons/table_battery20.svg";
import BatteryIcon40 from "/public/upload/icons/table_battery40.svg";
import BatteryIcon60 from "/public/upload/icons/table_battery60.svg";
import BatteryIcon80 from "/public/upload/icons/table_battery80.svg";
import BatteryIcon100 from "/public/upload/icons/table_battery100.svg";
import Image from "next/image";
import Link from "next/link";
import LiveIcon from "../../../../../public/upload/icons/live-icon";
import PlayStream from "../../../../../public/upload/icons/play-stream";

const columnHelper = createColumnHelper();

const IconSort = ({ isSort, isDesc }) => {
  return (
    <div className="flex flex-col space-y-1">
      <IoIosArrowUp
        size={12}
        color={`${isSort ? (isDesc ? "grey" : "white") : "grey"}`}
      />
      <IoIosArrowDown
        size={12}
        color={`${isSort ? (isDesc ? "white" : "grey") : "grey"}`}
      />
    </div>
  );
};

const batteryIndicator = (level) => {
  if (level == 0) {
    return BatteryIcon0;
  } else if (level > 0 && level <= 20) {
    return BatteryIcon20;
  } else if (level > 20 && level <= 40) {
    return BatteryIcon40;
  } else if (level > 40 && level <= 60) {
    return BatteryIcon60;
  } else if (level > 60 && level <= 80) {
    return BatteryIcon80;
  } else if (level > 80 && level <= 100) {
    return BatteryIcon100;
  }
};

const customStringSort = (rowA, rowB, id) => {
  const valueA = rowA.getValue(id) || ""; // Handle empty value as an empty string
  const valueB = rowB.getValue(id) || "";

  if (valueA === valueB) return 0; // If both are the same, no sorting needed

  // Sort empty values last
  if (valueA === "") return 1;
  if (valueB === "") return -1;

  return valueA.localeCompare(valueB); // Sort strings alphabetically
};

const TableRobotBase = ({ data, onDelete, onBulkDelete, fetchData }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [sorting, setSorting] = useState([
    { id: "attributes_displayName", desc: false },
  ]);
  const [tableData, setTableData] = useState([]);
  const [allCheck, setAllCheck] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewedItem, setViewedItem] = useState({});
  const [editDisplayName, setEditDisplayName] = useState(false);

  useEffect(() => {
    let temp =
      data?.map((item) => {
        return {
          ...item,
          checked: false,
        };
      }) || [];
    setTableData(temp);
    setAllCheck(false);
  }, [data]);

  const onSingleCheck = (e, row) => {
    let temp = tableData?.map((item) => {
      if (item?.id === row.id) {
        return { ...item, checked: e.currentTarget.checked };
      } else return item;
    });

    let checkAll = temp.find((item) => item.checked === false);
    if (checkAll) setAllCheck(false);
    else setAllCheck(true);

    setTableData(temp);
  };

  const onAllCheck = (e) => {
    setAllCheck(e.currentTarget.checked);
    let temp = [
      ...data.map((item) => {
        return {
          ...item,
          checked: e.currentTarget.checked,
        };
      }),
    ];

    setTableData(temp);
  };

  const checkSelected = () => {
    let exist = tableData.find((item) => item.checked === true);
    if (exist) return true;
    else return false;
  };

  const columns = [
    columnHelper.accessor("id", {
      header: () => null,
      cell: (info) => null,
      enableSorting: false,
    }),

    // columnHelper.accessor("checkbox", {
    //   id: "checkbox",
    //   header: () => {
    //     return (
    //       <div className="flex justify-center items-center">
    //         <input
    //           type="checkbox"
    //           checked={allCheck}
    //           className={"cursor-pointer rounded-2xl"}
    //           onChange={(e) => {
    //             onAllCheck(e);
    //           }}
    //         />
    //       </div>
    //     );
    //   },
    //   cell: (info) => {
    //     return (
    //       <div className="flex justify-center items-center">
    //         <input
    //           type="checkbox"
    //           checked={info.row.original.checked}
    //           className={"cursor-pointer rounded-2xl"}
    //           onChange={(e) => {
    //             onSingleCheck(e, info.row.original);
    //           }}
    //         />
    //       </div>
    //     );
    //   },
    //   enableSorting: false,
    // }),

    columnHelper.accessor("attributes.displayName", {
      header: () => {
        let isSort =
          sorting?.length > 0 && sorting[0]?.id == "attributes_displayName";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Robot Display Name</span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => (
        <Link href={`/robots/base/${info?.row.original?.id}`}>
          <span
            className="text-hyperLinkColor cursor-pointer"
            // onClick={() => console.log("robot", info?.row.original?.id)}
          >
            {info?.getValue()}
          </span>
        </Link>
      ),
    }),

    columnHelper.accessor("attributes.serialNumber", {
      header: () => {
        let isSort =
          sorting?.length > 0 && sorting[0]?.id == "attributes_serialNumber";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span>ID</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },

      cell: (info) => <span>{info.getValue() || "-"}</span>,
    }),
    columnHelper.accessor("attributes", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Bot Stream</span>
          </div>
        );
      },
      cell: (info) => (
        <div
          className="flex items-center gap-1  cursor-pointer"
          onClick={() => {
            (info?.getValue().workingStatus != "Offline" ||
              info?.getValue().displayName == "Robot 7") &&
              router.push(
                `/robots/route/live-monitoring/${info?.row?.original?.id}`
              );
          }}
        >
          {(info?.getValue().workingStatus != "Offline" ||
            info?.getValue().displayName == "Robot 7") && <LiveIcon />}
        </div>
      ),
    }),
    columnHelper.accessor("attributes.building.data.attributes.name", {
      id: "buildingName",
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "buildingName";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Assigned Site</span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info?.getValue(),
      enableSorting: true,
    }),

    columnHelper.accessor("attributes.workingStatus", {
      sortingFn: customStringSort,
      header: () => {
        let isSort =
          sorting?.length > 0 && sorting[0]?.id == "attributes_workingStatus";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Status</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("attributes.batteryPercentage", {
      header: () => {
        let isSort =
          sorting?.length > 0 &&
          sorting[0]?.id == "attributes_batteryPercentage";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Battery Level</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => (
        <div className="flex items-center gap-1">
          <span
            className={`font-semibold min-w-10`}
            style={{ color: RangeColor(info.getValue()) }}
          >
            {info.getValue() || 0}%
          </span>
          <Image
            alt="Battery status 20"
            src={batteryIndicator(info.getValue() || 0)}
            height={32}
            width={32}
          />
        </div>
      ),
    }),
    columnHelper.accessor("attributes.id", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-left space-x-5 ">
            <span className="text-sm font-semibold">Cleaning History</span>
          </div>
        );
      },
      cell: (info) => (
        <div
          className="flex items-center gap-1  cursor-pointer"
          onClick={() => {
            router.push(
              `/robots/route/plan-monitoring/${info?.row?.original?.id}`
            );
          }}
        >
          <PlayStream />
        </div>
      ),
    }),
    columnHelper.accessor("action", {
      enableSorting: false,
      header: () => (
        <div className="w-[100px] flex  items-center text-center">
          {isOnlyAdmin(user?.role) && checkSelected() ? (
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
            <></>
          )}
        </div>
      ),
      cell: (info) => {
        return (
          <ActionMenu
            view
            onViewClick={() => {
              // setViewedItem(info.row.original);
              // setDetailOpen(true);
              router.push(`/robots/base/${info.row.original?.id}`);
            }}
            report
            onReportClick={() => {
              router.push(`/reports?robot_id=${info.row.original?.id}`);
            }}
            edit={isOnlyAdmin(user?.role)}
            onEditClick={() => {
              setViewedItem(info.row.original);
              setEditDisplayName(true);
            }}
            // deleteAction={isOnlyAdmin(user?.role)}
            // onDeleteClick={() => {
            //   onDelete(info.row.original.id);
            // }}
          />
        );
      },
    }),
  ];

  return (
    <>
      <RobotDetailViewModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        bases={viewedItem}
      />
      <EditDisplayNameModal
        open={editDisplayName}
        onClose={() => setEditDisplayName(false)}
        selectedItem={viewedItem}
        fetchData={fetchData}
      />
      <div className="w-full text-sm font-bold">
        <Table
          columns={columns}
          data={tableData}
          throwSorting={(e) => {
            setSorting(e);
          }}
          defaultSorting={sorting}
          pathDetail={"/robots/base"}
          columnVisibility={{
            id: false,
            // checkbox: isOnlyAdmin(user?.role) ? true : false,
          }}
        />
      </div>
    </>
  );
};

export default TableRobotBase;
