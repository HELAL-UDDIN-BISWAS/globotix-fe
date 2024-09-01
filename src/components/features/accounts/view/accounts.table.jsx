import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ButtonIcon from "@/components/button/icon.button";
import Table from "@/components/common/table/table";
import IconTrash from "@/components/icons/iconTrash";
import useAuth from "@/hooks/useAuth";
import { isAdmin, isOnlyAdmin, isSuperAdmin } from "@/utils/helper";
import { createColumnHelper } from "@tanstack/react-table";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ActionMenu from "@/components/share/dropdown/actionMenu";
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

const TableAccounts = (props) => {
	const { user } = useAuth();
	const [sorting, setSorting] = useState([]);
	const router = useRouter();
	const [data, setData] = useState(() => []);
	const [allCheck, setAllCheck] = useState(false);

	useEffect(() => {
		let temp = props?.data?.map((item) => {
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
	const checkCanEdit = (info) => {
		if (isAdmin(user?.role)) {
			if (isSuperAdmin(user?.role)) {
				// If the user is a superadmin, they can edit anything
				return true;
			} else if (
				info?.row?.original?.attributes?.role?.data?.attributes?.name?.toLowerCase() !==
				"superadmin"
			) {
				// If the user is an admin but not a superadmin, they cannot edit superadmin
				return true;
			}
			return false;
		}

		if (user?.id == info?.row?.original?.id) {
			return true;
		}

		return false;
	};
	const shouldShowSelectAll = () => {
		if (isAdmin(user?.role)) {
			if (isSuperAdmin(user?.role)) {
				return true;
			}

			return false;
		}

		return false;
	};
	const columns = [
		columnHelper.accessor("checkbox", {
			header: () => (
				<div className="flex justify-center items-center">
					{shouldShowSelectAll() && (
						<input
							type="checkbox"
							checked={allCheck}
							className={"cursor-pointer rounded-2xl"}
							onChange={(e) => {
								onAllCheck(e);
							}}
						/>
					)}
				</div>
			),
			cell: (info) => (
				<div className="flex justify-center items-center">
					{user?.id != info?.row?.original?.id && checkCanEdit(info) && (
						<input
							type="checkbox"
							checked={info?.row?.original?.checked}
							className={"cursor-pointer rounded-2xl"}
							onChange={(e) => {
								onSingleCheck(e, info?.row?.original);
							}}
						/>
					)}
				</div>
			),

			enableSorting: false,
		}),
		columnHelper.accessor("attributes.username", {
			header: () => {
				let isSort =
					sorting?.length > 0 && sorting[0]?.id == "attributes_username";
				let isDesc = sorting[0]?.desc;

				return (
					<div className="w-[120px]  flex justify-between items-center text-left space-x-5">
						<span className="text-sm font-semibold">Name</span>

						<IconSort isSort={isSort} isDesc={isDesc} />
					</div>
				);
			},
			cell: (info) => info?.row?.original?.attributes?.username,
		}),
		columnHelper.accessor("attributes.organization.data.attributes.name", {
			header: () => {
				let isSort =
					sorting?.length > 0 &&
					sorting[0]?.id == "attributes_organization.data.attributes.name";
				let isDesc = sorting[0]?.desc;

				return (
					<div className="w-[120px] flex justify-between items-center text-left space-x-5">
						<span className="text-sm font-semibold">Organization</span>

						<IconSort isSort={isSort} isDesc={isDesc} />
					</div>
				);
			},
			cell: (info) => (
				<span>
					{info?.row?.original?.attributes?.organization?.data?.attributes
						?.name || ""}
				</span>
			),
		}),
		columnHelper.accessor("attributes.buildings", {
			header: () => {
				let isSort =
					sorting?.length > 0 && sorting[0]?.id == "attributes_buildings";
				let isDesc = sorting[0]?.desc;

				return (
					<div className="w-[180px] flex justify-between items-center text-left space-x-5">
						<span className="text-sm font-semibold">Building</span>

						<IconSort isSort={isSort} isDesc={isDesc} />
					</div>
				);
			},
			cell: (info) => (
				<div className="flex flex-col">
					<span>
						{info?.row?.original?.attributes?.buildings?.data
							?.map((item) => item?.attributes?.name)
							.join(", ") || ""}
					</span>
				</div>
			),
		}),

		columnHelper.accessor("attributes.role", {
			header: () => {
				let isSort = sorting?.length > 0 && sorting[0]?.id == "attributes_role";
				let isDesc = sorting[0]?.desc;

				return (
					<div className="flex justify-between items-center text-left space-x-5">
						<span className="text-sm font-semibold">Access Level</span>

						<IconSort isSort={isSort} isDesc={isDesc} />
					</div>
				);
			},
			cell: (info) => (
				<span className="capitalize">
					{info?.row?.original?.attributes?.role?.data?.attributes?.name?.toLowerCase()}
				</span>
			),
			sortingFn: (rowA, rowB, columnId) => {
				const roleA =
					rowA.original.attributes.role.data.attributes.name.toLowerCase();
				const roleB =
					rowB.original.attributes.role.data.attributes.name.toLowerCase();
				return roleA.localeCompare(roleB);
			},
		}),

		columnHelper.accessor("attributes.status", {
			header: () => {
				let isSort =
					sorting?.length > 0 && sorting[0]?.id == "attributes_status";
				let isDesc = sorting[0]?.desc;

				return (
					<div className="flex justify-between items-center text-left space-x-5">
						<span className="text-sm font-semibold">Status</span>

						<IconSort isSort={isSort} isDesc={isDesc} />
					</div>
				);
			},
			cell: (info) => info?.row?.original?.attributes?.status,
		}),

		columnHelper.accessor("action", {
			header: () => (
				<div className="w-[100px] flex justify-center items-center text-center">
					{isAdmin(user?.role) && checkSelected() ? (
						<ButtonIcon
							isHover
							className="bg-primary02"
							onClick={() =>
								props?.onBulkDelete(
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
			cell: (info) => {
				return (
					<ActionMenu
						view
						onViewClick={() => {
							router?.push(`/accounts/${info?.row?.original?.id}`);
						}}
						edit={checkCanEdit(info)}
						onEditClick={() => {
							router?.push(`/accounts/edit/${info?.row?.original?.id}`);
						}}
						deleteAction={checkCanEdit(info)}
						onDeleteClick={() => {
							props?.onDelete(info?.row?.original?.id);
						}}
					/>
				);
			},
		}),
	];

	return (
		<div className="w-full">
			<Table
				columns={columns}
				data={data}
				throwSorting={(e) => setSorting(e)}
				pathDetail={"/accounts"}
				enableSortingRemoval={false}
			/>
		</div>
	);
};

export default TableAccounts;
