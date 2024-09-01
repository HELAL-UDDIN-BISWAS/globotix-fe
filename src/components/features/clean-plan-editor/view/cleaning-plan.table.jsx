import { useEffect, useState } from "react";
import moment from "moment";

import { useRouter } from "next/navigation";

import Table from "@/components/common/table/table";
import { RangeColor, isAdmin } from "@/utils/helper";
import { createColumnHelper } from "@tanstack/react-table";
import Pagination from "@/components/common/table/pagination";
import dayjs from "dayjs";
import useAuth from "@/hooks/useAuth";
import ActionMenu from "@/components/share/dropdown/actionMenu";
import ButtonIcon from "@/components/button/icon.button";
import IconTrash from "@/components/icons/iconTrash";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const columnHelper = createColumnHelper();

const TableCleaningPlan = (props) => {
  const { user } = useAuth();
  const [sorting, setSorting] = useState([]);
  const router = useRouter();
  const [data, setData] = useState(() => []);
  const [allCheck, setAllCheck] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);

  useEffect(() => {
    let temp = props.data.map((item) => {
      const isChecked = item.id == props.planId;
      return {
        ...item,
        checked: isChecked,
      };
    });
    setData(temp);
    setAllCheck(false);
  }, [props.data, props.planId]);

  const onSingleCheck = (e, row) => {
    const isChecked = e.currentTarget.checked;
    const temp = data.map((item) => {
      if (item.id === row.id) {
        return { ...item, checked: isChecked };
      }
      return { ...item, checked: false };
    });
    setData(temp);
    // props.onBulkDelete(isChecked ? row : null);
    setSelectedRow(isChecked ? row : null);
  };

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

  const checkSelected = () => {
    let exist = data.find((item) => item.checked === true);
    if (exist) return true;
    else return false;
  };

  const getBaseName = (val) => {
    let rbt = props?.listRobot.find((item) => val === item.base_name);

    return rbt?.display_name || "";
  };

  const columns = [
    columnHelper.accessor("radio", {
      header: () => (
        <div className="flex justify-center items-center">
          {/* <input
            type="radio"
            checked={allCheck}
            className={"cursor-pointer rounded-2xl"}
            onChange={(e) => {
              onAllCheck(e);
            }}
          /> */}
        </div>
      ),
      cell: (info) => (
        <div className="flex justify-center items-center">
          <input
            type="radio"
            checked={info.row.original.checked}
            className={`cursor-pointer rounded-2xl bg-white`}
            onChange={(e) => {
              onSingleCheck(e, info.row.original);
            }}
          />
        </div>
      ),
      enableSorting: true,
    }),

    columnHelper.accessor("name", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "name";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left  space-x-5">
            <span className="text-sm font-semibold">Cleaning Plan Name</span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => (
        <div className="flex flex-col">
          <span className="text-xs">{info.row.original?.name}</span>
        </div>
      ),
      enableSorting: true,
    }),

    columnHelper.accessor("location", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "location";
        let isDesc = sorting[0]?.desc;
        return (
          <div className="flex justify-between items-center text-left  space-x-5">
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
          <div className="flex justify-between items-center text-left  space-x-5">
            <span className="text-sm font-semibold whitespace-nowrap">
              Building Name
            </span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => {
        return (
          <div className="flex space-x-2">
            <span>{info.getValue()}</span>
          </div>
        );
      },
      enableSorting: true,
    }),
    columnHelper.accessor("createdBy", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "createdBy";
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
        let isSort = sorting?.length > 0 && sorting[0]?.id == "updatedBy";
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
    columnHelper.accessor("updatedDate", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "updatedDate";
        let isDesc = sorting[0]?.desc;
        return (
          <div className="flex justify-between items-center text-left  space-x-5">
            <span className="text-sm font-semibold whitespace-nowrap">
              Last Modified Date
            </span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => {
        return (
          <div className="flex space-x-2">
            <span>
              {dayjs(info.row.original?.updatedDate).format(
                "DD/MM/YYYY hh:mm:ss"
              )}
            </span>
          </div>
        );
      },
      enableSorting: true,
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
            router.push(`/cleaning-plan/${info.row.original.id}`);
          }}
        />
      ),
    }),
  ];

  return (
    <>
      <div className="w-full h-[500px] overflow-auto no-scrollbar">
        <Table
          columns={columns}
          data={data}
          throwSorting={(e) => setSorting(e)}
          pathDetail={"/schedule"}
        />
      </div>
      <Pagination
        {...props.query}
        pageCount={props.pageCount}
        handlePageChange={props.handlePageChange}
      />
    </>
  );
};

export default TableCleaningPlan;
