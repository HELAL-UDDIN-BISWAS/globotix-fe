"use client";
import { useEffect, useState } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { RangeColor, isAdmin, isSuperAdmin } from "@/utils/helper";
import { useRouter } from "next/navigation";
import Table from "@/components/common/table/table";

import ButtonIcon from "@/components/button/icon.button";

import IconTrash from "@/components/icons/iconTrash";

import useAuth from "@/hooks/useAuth";
import moment from "moment";
import ActionMenu from "@/components/share/dropdown/actionMenu";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const columnHelper = createColumnHelper();

const IconSort = ({ isSort, isDesc }) => {
  return (
    <div className="flex flex-col ">
      <IoIosArrowUp
        size={12}
        color={`${isSort ? (isDesc ? "gray" : "white") : "gray"}`}
      />
      <IoIosArrowDown
        size={12}
        color={`${isSort ? (isDesc ? "white" : "gray") : "gray"}`}
      />
    </div>
  );
};

const TableLocation = (props) => {
  const [sorting, setSorting] = useState([]);
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(() => []);
  const [allCheck, setAllCheck] = useState(false);

  useEffect(() => {
    let temp = props.data.map((item) => {
      return {
        ...item,
        checked: false,
      };
    });
    setData(temp);
    setAllCheck(false);
  }, [props.data]);

  const onSingleCheck = (e, row) => {
    let temp = [...data];
    let item = temp.find((item) => item.id === row.id);
    item.checked = e.currentTarget.checked;

    let checkAll = temp.find((item) => item.checked === false);
    if (checkAll) setAllCheck(false);
    else setAllCheck(true);

    setData(temp);
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

    setData(temp);
  };

  const checkSelected = () => {
    let exist = data.find((item) => item.checked === true);
    if (exist) return true;
    else return false;
  };

  const columns = [
    columnHelper.accessor("name", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "name";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Location Name</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("building.name", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "building_name";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Building Name</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("mapName", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "mapName";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Map Name</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("createdBy", {
      header: () => {
        let isSort =
          sorting?.length > 0 &&
          sorting[0]?.id == "attributes_cleaningDuration";
        let isDesc = sorting[0]?.desc;
        return (
          <div className="flex justify-between items-center text-left  space-x-5">
            <span className="text-sm font-semibold whitespace-nowrap">
              Created By
            </span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => {
        return (
          <div className="flex space-x-2">
            <span>{info.row.original?.createdBy ?? "-"}</span>
          </div>
        );
      },
      enableSorting: true,
    }),
    columnHelper.accessor("updatedBy", {
      header: () => {
        let isSort =
          sorting?.length > 0 &&
          sorting[0]?.id == "attributes_cleaningDuration";
        let isDesc = sorting[0]?.desc;
        return (
          <div className="flex justify-between items-center text-left  space-x-5">
            <span className="text-sm font-semibold whitespace-nowrap">
              Last Modified By
            </span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => {
        return (
          <div className="flex space-x-2">
            <span>{info.row.original?.updatedBy ?? "-"}</span>
          </div>
        );
      },
      enableSorting: true,
    }),

    columnHelper.accessor("lastUpdated", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "lastUpdated";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Last Modified Date</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => {
        return (
          <div className="flex space-x-2">
            <span>
              {moment(new Date(info?.getValue()?.slice(0, -1))).format(
                "DD/MM/YYYY HH:mm:ss"
              )}
            </span>
          </div>
        );
      },
    }),

    columnHelper.accessor("action", {
      header: () => (
        <div className="w-[20px] flex justify-center items-center text-center">
          {isAdmin(user?.role) && checkSelected() ? (
            <ButtonIcon
              isHover
              onClick={() =>
                props.onBulkDelete(
                  data
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
      cell: (info) => (
        //   console.log("info", info),
        // <div className="flex space-x-1">
        //   <ButtonIcon
        //     url={`/location/${info.row.original.id}`}
        //     icon={<IconEyeDetail />}
        //     label="View Location"
        //   />
        // </div>
        <ActionMenu
          view
          onViewClick={() => {
            props?.onView(info?.row?.original);
          }}
          viewLabel={"View & Edit"}
          edit={isAdmin(user?.role)}
          onEditClick={() => {
            props?.onEdit(info?.row?.original);
          }}
          editLabel={"Edit Name"}
        />
      ),
    }),
  ];

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={data}
        throwSorting={(e) => setSorting(e)}
        pathDetail={"/location"}
      />
      {/* <Pagination
        {...props.query}
        pageCount={props.pageCount}
        handlePageChange={props.handlePageChange}
      /> */}
    </div>
  );
};

export default TableLocation;
