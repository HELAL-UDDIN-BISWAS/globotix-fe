import { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";

import Table from "@/components/common/table/table";
import { RangeColor } from "@/utils/helper";
import { createColumnHelper } from "@tanstack/react-table";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ActionMenu from "@/components/share/dropdown/actionMenu";
import dayjs from "dayjs";
import Pagination from "@/components/common/table/pagination";
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

const TableReports = (props) => {
  const [sorting, setSorting] = useState([]);
  const router = useRouter();
  const [data, setData] = useState(() => []);

  useEffect(() => {
    let temp = props.data.map((item) => {
      return {
        ...item,
      };
    });
    setData(temp);
  }, [props.data]);

  const onSingleCheck = (row) => {
    console.log(checkSelected(row?.id));
    console.log("row", row);
    if (checkSelected(row?.id)) {
      props?.setDataChecklist(
        props?.dataChecklist.filter((e) => e.id != row.id)
      );
    } else {
      props?.setDataChecklist((prev) => [...prev, row]);
    }
  };

  const onAllCheck = () => {
    let notExisted = [];
    props?.dataChecklist?.map((checked) => {
      const isInclude = data?.find((e) => checked?.id === e?.id);
      if (!isInclude) notExisted.push(checked);
    });

    if (checkAllSelected()) {
      props?.setDataChecklist(notExisted);
    } else {
      props?.setDataChecklist(notExisted.concat(data));
    }
  };

  const checkSelected = (id) => {
    let exist = props?.dataChecklist?.find((item) => item.id === id);
    if (exist) return true;
    else return false;
  };

  const checkAllSelected = () => {
    if (data?.length > props?.dataChecklist) {
      return false;
    } else {
      const existedList = [];
      data?.map((e) => {
        const existed = props?.dataChecklist?.find(
          (checked) => e?.id == checked?.id
        );
        if (existed) existedList.push(e);
      });

      if (existedList?.length == data?.length) {
        return true;
      } else {
        return false;
      }
    }
  };

  const columns = [
    columnHelper.accessor("checkbox", {
      header: () => (
        <div className="flex justify-center items-center">
          <input
            type="checkbox"
            checked={checkAllSelected()}
            className={"cursor-pointer rounded-2xl"}
            onChange={(e) => {
              onAllCheck();
            }}
          />
        </div>
      ),
      cell: (info) => (
        <div className="flex justify-center items-center">
          <input
            type="checkbox"
            checked={checkSelected(info.row.original.id)}
            className={"cursor-pointer rounded-2xl"}
            onChange={(e) => {
              onSingleCheck(info.row.original);
            }}
          />
        </div>
      ),
      enableSorting: false,
    }),

    columnHelper.accessor("attributes.location.data.attributes.name", {
      id: "location",
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "location";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left  space-x-5">
            <div className="flex flex-col justify-start items-start text-left">
              <span className="text-sm font-semibold">Location</span>
              <span className="text-xs font-light">Building Name</span>
            </div>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => (
        <div className="flex flex-col">
          <span>
            {info.row.original.attributes?.location?.data?.attributes?.name}
          </span>
          <span className="text-xs">
            {
              info.row.original.attributes?.location?.data?.attributes?.building
                ?.data?.attributes?.name
            }
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("attributes.startIso8601Time", {
      header: () => {
        let isSort =
          sorting?.length > 0 &&
          sorting[0]?.id == "attributes?_startIso8601Time";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left  space-x-5">
            <span className="text-sm font-semibold whitespace-nowrap">
              Start Time
            </span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => {
        const dateString = info.getValue();
        if (!dateString) return "";
        const date = moment(dateString);

        if (date?.isValid()) {
          return (
            <div className="flex space-x-2">
              <span>{date?.format("DD/MM/YYYY HH:mm:ss")}</span>
            </div>
          );
        } else {
          return <span>N/A</span>;
        }
      },
    }),
    columnHelper.accessor("attributes.cleaningDuration", {
      header: () => {
        let isSort =
          sorting?.length > 0 &&
          sorting[0]?.id == "attributes_cleaningDuration";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Duration</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("attributes.robot.data.attributes.displayName", {
      id: "robot_name",
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "robot_name";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left  space-x-5">
            <span className="text-sm font-semibold">Robot Name</span>
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
    columnHelper.accessor("attributes.coveragePercentage", {
      header: () => {
        let isSort =
          sorting?.length > 0 &&
          sorting[0]?.id == "attributes_coveragePercentage";
        let isDesc = sorting[0]?.desc;
        return (
          <div className="flex justify-between items-center text-left  space-x-5">
            <span className="text-sm font-semibold">Coverage</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => {
        if (info.row.original?.attributes?.coveragePercentage) {
          return (
            <span
              className={`font-semibold`}
              style={{
                color: RangeColor(info.getValue()),
              }}
            >
              {parseFloat(info.getValue()).toFixed(2)}%
            </span>
          );
        } else {
          return "";
        }
      },
    }),
    columnHelper.accessor("attributes.cleaningStatus", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-left  space-x-5">
            <span className="text-sm font-semibold">Status</span>
          </div>
        );
      },
      cell: (info) => info.row.original?.attributes?.cleaningStatus,
    }),
    columnHelper.accessor("action", {
      header: () => (
        <div className="w-10 flex justify-start items-center text-center">
          {/* {checkSelected() ? (
            <ButtonIcon
              isHover
              onClick={() =>
                props.onBulkDelete(
                  data
                    .filter((item) => item.checked === true)
                    .map((item) => item._id)
                )
              }
              icon={<IconDownload />}
              label="Download Selected"
            />
          ) : (
            <></>
          )} */}
        </div>
      ),
      cell: (info) => (
        <ActionMenu
          view
          onViewClick={(e) => {
            e.preventDefault();
            const url = `/reports/${info.row.original?.id}`;
              router.push(url);
          }}
          onViewMouseDown={(e) => {
            e.preventDefault();
            const url = `/reports/${info.row.original?.id}`;
            if(e.button === 1) {
              window.open(url, '_blank')
            }
          }}
        />
      ),
    }),
  ];
  

  return (
    <>
      <div className="w-full">
        <Table
          columns={columns}
          data={data}
          throwSorting={(e) => setSorting(e)}
          pathDetail={"/reports"}
        />
      </div>
      <Pagination
        page={props.pagination?.page}
        pageCount={props.pagination?.pageCount}
        handlePageChange={props.pagination?.handlePageChange}
      />
    </>
  );
};

export default TableReports;
