import { useEffect, useState } from "react";
import moment from "moment";

import { useRouter } from "next/navigation";

import Table from "@/components/common/table/table";
import { RangeColor } from "@/utils/helper";
import { createColumnHelper } from "@tanstack/react-table";
import Pagination from "@/components/common/table/pagination";

const columnHelper = createColumnHelper();

const TableCleaningPlan = (props) => {
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
    props.onSelect(isChecked ? row : null);
    setSelectedRow(isChecked ? row : null);
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
      enableSorting: false,
    }),

    columnHelper.accessor("name", {
      header: () => (
        <div className="flex flex-col justify-start items-start text-left">
          <span className="text-sm font-semibold">Cleaning Plan Name</span>
        </div>
      ),
      cell: (info) => (
        <div className="flex flex-col justify-start items-start">
          <span className="text-xs">{info.row.original?.name}</span>
        </div>
      ),
      enableSorting: false,
    }),

    columnHelper.accessor("location", {
      header: () => {
        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Location Name</span>
          </div>
        );
      },
      cell: (info) => (
        <div className="flex flex-col justify-start items-start">
          <span className="text-xs">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("building", {
      header: () => (
        <div className="flex flex-col justify-start items-start text-left">
          <span className="text-sm font-semibold whitespace-nowrap">
            Building Name
          </span>
        </div>
      ),
      cell: (info) => {
        return (
          <div className="flex flex-col justify-start items-start">
            <span>{info.getValue()}</span>
          </div>
        );
      },
      enableSorting: false,
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
