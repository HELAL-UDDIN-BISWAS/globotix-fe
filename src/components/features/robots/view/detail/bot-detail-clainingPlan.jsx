import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdOutlineCheckBox,
} from "react-icons/md";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import ButtonIcon from "@/components/button/icon.button";
import IconTrash from "@/components/icons/iconTrash";
import { useParams, useRouter } from "next/navigation";
import Table from "@/components/common/table/table";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { isAdmin, isSuperAdmin } from "@/utils/helper";
import ActionMenu from "@/components/share/dropdown/actionMenu";
import useCleaningPlanEditor from "@/hooks/useCleaningPlanEditor";
import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";

const socket = io(API_URL, { transport: ["websocket"] });

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

const BotDetailCleaningPlan = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { getCleaningPlan, plans } = useCleaningPlanEditor();
  const [sorting, setSorting] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [allCheck, setAllCheck] = useState(false);

  const fetchData = async () => {
    await getCleaningPlan({ robotId: params?.robotId });
  };

  useEffect(() => {
    plans && setTableData(plans);
  }, [plans]);

  useEffect(() => {
    fetchData();
  }, []);
  console.log("plans", plans);

  socket.on("robot-flexadev-queue", (arg) => {
    if (arg.table_name === "robot") {
      fetchData();
    }
  });

  const onSingleCheck = (e, row) => {
    let temp = [...tableData];
    let item = temp.find((item) => item.id === row.id);
    item.checked = e;

    let checkAll = temp.find((item) => item.checked === false);
    if (checkAll) setAllCheck(false);
    else setAllCheck(true);

    setTableData(temp);
  };

  const onAllCheck = (e) => {
    setAllCheck(e);
    let temp = [
      ...tableData.map((item) => {
        return {
          ...item,
          checked: e,
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
    //   header: () => (
    //     <div className="flex justify-center items-center">
    //       {allCheck ? (
    //         <MdOutlineCheckBox
    //           size={24}
    //           className="text-white "
    //           onClick={() => onAllCheck(false)}
    //         />
    //       ) : (
    //         <div
    //           className=" bg-white border border-placeholder rounded-sm h-[18px] w-[18px]"
    //           onClick={() => onAllCheck(true)}
    //         ></div>
    //       )}
    //     </div>
    //   ),
    //   cell: (info) => (
    //     <div className="flex justify-center items-center">
    //       {info.row.original.checked ? (
    //         <MdCheckBox
    //           size={24}
    //           className="text-primary"
    //           onClick={() => onSingleCheck(false, info.row.original)}
    //         />
    //       ) : (
    //         <MdCheckBoxOutlineBlank
    //           size={24}
    //           className="text-placeholder"
    //           onClick={() => onSingleCheck(true, info.row.original)}
    //         />
    //       )}
    //     </div>
    //   ),
    //   enableSorting: false,
    // }),

    columnHelper.accessor("name", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "name";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span>Plan</span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => (
        <Link href={`/`}>
          <span className="text-hyperLinkColor cursor-pointer">
            {info?.getValue()}
          </span>
        </Link>
      ),
    }),

    columnHelper.accessor("attributes.type", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "attributes_type";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span>Plan Type</span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },

      cell: (info) => <span>{info.getValue() || "-"}</span>,
    }),

    columnHelper.accessor("attributes.estimateDuration", {
      header: () => {
        let isSort =
          sorting?.length > 0 &&
          sorting[0]?.id == "attributes_estimateDuration";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Estimate Duration</span>
            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info?.getValue()?.data?.attributes?.name,
    }),

    // columnHelper.accessor("action", {
    //   header: () => (
    //     <div className="w-[100px] flex  items-center text-center">
    //       {isSuperAdmin(user?.role) && checkSelected() && (
    //         <ButtonIcon
    //           isHover
    //           onClick={() =>
    //             onBulkDelete(
    //               tableData
    //                 .filter((item) => item.checked === true)
    //                 .map((item) => item.id)
    //             )
    //           }
    //           icon={<IconTrash />}
    //           label="Delete Selected"
    //         />
    //       )}
    //     </div>
    //   ),
    //   cell: (info) => {
    //     return <ActionMenu view onViewClick={() => {}} />;
    //   },
    // }),
  ];
  return (
    <>
      <div className="w-full text-sm font-bold">
        <Table
          columns={columns}
          data={tableData}
          throwSorting={(e) => setSorting(e)}
          defaultSorting={sorting}
          pathDetail={"/robots/base"}
          columnVisibility={{ id: false }}
        />
      </div>
    </>
  );
};

export default BotDetailCleaningPlan;
