import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ButtonIcon from "@/components/button/icon.button";
import Table from "@/components/common/table/table";
import IconEyeDetail from "@/components/icons/iconEyeDetail";
import IconReports from "@/components/icons/iconReports";
import IconTrash from "@/components/icons/iconTrash";
import useAuth from "@/hooks/useAuth";
import { isAdmin } from "@/utils/helper";
import { createColumnHelper } from "@tanstack/react-table";
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

const TableRobotModule = (props) => {
  const { user } = useAuth();
  const [sorting, setSorting] = useState([]);
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

    columnHelper.accessor("name", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "serial";
        let isDesc = sorting[0]?.desc;
        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Display Name</span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("serial", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "serial";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Serial No</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("status", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "status";
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

    columnHelper.accessor("location", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "location";
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

    columnHelper.accessor("cleaning_plan", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "cleaning_plan";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Location</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("base", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <div className="flex flex-col ">
              <span className="text-xs font-light">attached</span>
              <span className="text-sm font-semibold">Base</span>
            </div>
          </div>
        );
      },
      cell: (info) => info.getValue(),
      enableSorting: false,
    }),

    columnHelper.accessor("dust_tank", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-center space-x-5">
            <div className="flex flex-col w-full justify-center items-center ">
              <span className="text-sm font-semibold">Dust</span>
              <span className="text-sm font-semibold">Tank</span>
            </div>
          </div>
        );
      },
      cell: (info) => (
        <div className="flex w-full justify-center items-center">
          <Image
            src={`/assets/icons/icon_good.svg`}
            width={20}
            height={20}
            alt=""
          />
        </div>
      ),
      enableSorting: false,
    }),

    columnHelper.accessor("filter", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-center space-x-5">
            <div className="flex flex-col w-full justify-center items-center ">
              <span className="text-sm font-semibold">filter</span>
            </div>
          </div>
        );
      },
      cell: (info) => (
        <div className="flex w-full justify-center items-center">
          <Image
            src={`/assets/icons/icon_good.svg`}
            width={20}
            height={20}
            alt=""
          />
        </div>
      ),
      enableSorting: false,
    }),

    columnHelper.accessor("main_brush", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-center space-x-5">
            <div className="flex flex-col w-full justify-center items-center ">
              <span className="text-sm font-semibold">Main</span>
              <span className="text-sm font-semibold">Brush</span>
            </div>
          </div>
        );
      },
      cell: (info) => (
        <div className="flex w-full justify-center items-center">
          <Image
            src={`/assets/icons/icon_warning.svg`}
            width={20}
            height={20}
            alt=""
          />
        </div>
      ),
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
            url={`/robots/module/${info.row.original.id}`}
            icon={<IconEyeDetail />}
            label="View Detail"
          />
          <ButtonIcon
            onClick={() => {}}
            icon={<IconReports />}
            label="View Report"
          />
          {isAdmin(user?.role) ? (
            <ButtonIcon
              onClick={() => props.onDelete(info.row.original.id)}
              icon={<IconTrash />}
              label="Delete Module"
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
        pathDetail={"/robots/module"}
      />
    </div>
  );
};

export default TableRobotModule;
