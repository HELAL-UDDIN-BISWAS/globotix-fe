"use client";
import { useEffect, useState } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import IconReports from "@/components/icons/iconReports";
import Link from "next/link";
import ChecboxInput from "@/components/form/checkbox.input";
import { RangeColor, isAdmin } from "@/utils/helper";
import { useRouter } from "next/navigation";
import Table from "@/components/common/table/table";
import Image from "next/image";
import ButtonIcon from "@/components/button/icon.button";
import IconEyeDetail from "@/components/icons/iconEyeDetail";
import IconTrash from "@/components/icons/iconTrash";
import useAuth from "@/hooks/useAuth";
const columnHelper = createColumnHelper();

const IconSort = ({ isSort, isDesc }) => {
  return (
    <div className="flex flex-col space-y-1">
      <Image
        src="/assets/icons/icon_triangle.svg"
        width={9}
        height={5}
        alt=""
        className={`${
          isSort
            ? isDesc
              ? "brightness-50"
              : "brightness-100"
            : "brightness-50"
        }`}
      />
      <Image
        src="/assets/icons/icon_triangle.svg"
        width={9}
        height={5}
        alt=""
        className={`rotate-180 ${
          isSort
            ? isDesc
              ? "brightness-100"
              : "brightness-50"
            : "brightness-50"
        }`}
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
    let item = temp.find((item) => item._id === row._id);
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
    columnHelper.accessor("checkbox", {
      header: () => (
        <div className="flex justify-center items-center">
          <input
            type="checkbox"
            checked={allCheck}
            className={"cursor-pointer rounded-2xl"}
            onChange={(e) => {
              onAllCheck(e);
            }}
          />
        </div>
      ),
      cell: (info) => (
        <div className="flex justify-center items-center">
          <input
            type="checkbox"
            checked={info.row.original.checked}
            className={"cursor-pointer rounded-2xl"}
            onChange={(e) => {
              onSingleCheck(e, info.row.original);
            }}
          />
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("plan_id", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "plan_id";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Location ID</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("plan_name", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "plan_name";
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

    columnHelper.accessor("building", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "building";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Building</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("publish_version", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "publish_version";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Published Plan</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("modified_date", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "modified_date";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Last Modified Date </span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("est_duration", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Est. Duration</span>
          </div>
        );
      },
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),

    columnHelper.accessor("est_cleaning_area", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Est. Cleaning Area</span>
          </div>
        );
      },
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),

    columnHelper.accessor("action", {
      header: () => (
        <div className="w-[100px] flex justify-center items-center text-center">
          {isAdmin(user?.role) && checkSelected() ? (
            <ButtonIcon
              isHover
              onClick={() =>
                props.onBulkDelete(
                  data
                    .filter((item) => item.checked === true)
                    .map((item) => item._id)
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
        <div className="flex space-x-1">
          <ButtonIcon
            url={`/location/${info.row.original._id}`}
            icon={<IconEyeDetail />}
            label="View Location"
          />
          <ButtonIcon
            icon={<IconReports />}
            label="View Report"
            onClick={() => {}}
          />

          {isAdmin(user?.role) ? (
            <ButtonIcon
              onClick={() => props.onDelete(info.row.original._id)}
              icon={
                <span className="text-red-1">
                  <IconTrash />
                </span>
              }
              label="Delete Location"
            />
          ) : (
            <></>
          )}
        </div>
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
    </div>
  );
};

export default TableLocation;
