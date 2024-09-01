import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";

import ButtonIcon from "@/components/button/icon.button";
import Table from "@/components/common/table/table";
import IconEyeDetail from "@/components/icons/iconEyeDetail";
import IconTrash from "@/components/icons/iconTrash";
import useAuth from "@/hooks/useAuth";
import { isAdmin } from "@/utils/helper";
import { createColumnHelper } from "@tanstack/react-table";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ActionMenu from "@/components/share/dropdown/actionMenu";
import Link from "next/link";
const columnHelper = createColumnHelper();

const IconSort = ({ isSort, isDesc }) => {
  return (
    <div className="flex flex-col ">
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

const TableOrganizationsDetails = (props) => {
  const { slug } = useParams();
  console.log(slug);
  const organizationSlug = slug.join("/");
  const { user } = useAuth();
  const [sorting, setSorting] = useState([]);
  const router = useRouter();
  const [data, setData] = useState(() => []);
  const [allCheck, setAllCheck] = useState(false);
  const transformNameToUrl = (name) => {
    return name?.toLowerCase().replace(/\s+/g, "-");
  };
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
    let item = temp?.find((item) => item?.id == row?.id);
    item.checked = e.currentTarget.checked;

    let checkAll = temp.find((item) => item.checked === false);
    if (checkAll) setAllCheck(false);
    else setAllCheck(true);

    setData(temp);
  };

  const checkSelected = () => {
    let exist = data.find((item) => item?.checked === true);
    if (exist) return true;
    else return false;
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

  const columns = [
    columnHelper.accessor("checkbox", {
      header: () => (
        <div className="flex justify-center items-center">
          <input
            type="checkbox"
            checked={allCheck}
            className={"cursor-pointer rounded-2xl "}
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
            className={"cursor-pointer rounded-2xl bg-primary"}
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
        let isSort = sorting?.length > 0 && sorting[0]?.id == "name";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Site</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => (
        <div className="flex flex-row items-center">
          {/* <Link
            href={`/organization/${organizationSlug}/${transformNameToUrl(info?.row?.original?.name)}`}
          > */}
          <span className="text-[#004FF0]">{info?.row?.original?.name}</span>
          {/* </Link> */}
        </div>
      ),
    }),
    columnHelper.accessor("total_users", {
      header: () => {
        let isSort = sorting?.length > 0 && sorting[0]?.id == "total_users";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Site Admins</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("total_assignedRobots", {
      header: () => {
        let isSort =
          sorting?.length > 0 && sorting[0]?.id == "total_assignedRobots";
        let isDesc = sorting[0]?.desc;

        return (
          <div className="flex justify-between items-center text-left space-x-5">
            <span className="text-sm font-semibold">Assigned Bots</span>

            <IconSort isSort={isSort} isDesc={isDesc} />
          </div>
        );
      },
      cell: (info) => info.getValue(),
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
                    .map((item) => item?.id)
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
        <ActionMenu
          view
          onViewClick={() => {
            props?.onView(info?.row?.original, organizationSlug);
          }}
          edit={isAdmin(user?.role)}
          onEditClick={() => {
            router?.push(`/organization/edit/${info?.row?.original?.id}`);
          }}
        />
      ),
    }),
  ];

  return (
    <div className="w-full mt-10">
      <Table
        columns={columns}
        data={data}
        throwSorting={(e) => setSorting(e)}
        pathDetail={"/building"}
      />
    </div>
  );
};

export default TableOrganizationsDetails;
