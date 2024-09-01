import React, { useMemo } from "react";
import moment from "moment";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
} from "@tanstack/react-table";
import ViewAllHeader from "./ViewAllHeader";

const columns = [
	{
		accessorKey: "attributes.robot.data.attributes.baseName",
		header: "Bot Name",
		cell: ({ row }) => (
			<span className="text-[#667085] justify-self-start text-[14px] font-bold">
				{row?.original?.attributes?.robot?.data?.attributes?.baseName}
			</span>
		),
	},
	{
		accessorKey: "attributes.activity",
		header: "Activity",
		cell: ({ row }) => (
			<span className="text-bodyTextColor text-[14px] font-normal">
				{row?.original?.attributes?.activity}
			</span>
		),
	},
	{
		accessorKey: "attributes.createdOn",
		header: "Created On",
		cell: ({ getValue }) => {
			const dateTime = getValue();
			return (
				<span className="text-right text-[#667085] text-[12px] font-normal">
					<span className="block">{moment(dateTime)?.format("HH:mm:ss")}</span>
					<span className="block">
						{moment(dateTime)?.format("MM/DD/YYYY")}
					</span>
				</span>
			);
		},
	},
];

const ActivityLog = ({ activityLog }) => {
	const data = useMemo(() => activityLog || [], [activityLog]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="flex flex-col gap-2 h-full rounded-[5px] bg-white">
			<ViewAllHeader title="Activity Log" padding="4" />
			<table className="w-full overflow-y-auto z-0">
				<tbody>
					{table?.getRowModel()?.rows?.map((row, rowIndex) => (
						<tr
							key={row?.id}
							className={rowIndex % 2 === 0 ? "bg-[#F7F7F9]" : "bg-white"}>
							{row?.getVisibleCells()?.map((cell) => (
								<td key={cell?.id} className="px-4 py-1">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ActivityLog;
