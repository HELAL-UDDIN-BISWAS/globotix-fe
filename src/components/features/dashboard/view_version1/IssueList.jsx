import React from "react";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
} from "@tanstack/react-table";
import ViewAllHeader from "./ViewAllHeader";

const columns = [
	{
		accessorKey: "baseName",
		header: "Bot Name",
		cell: ({ row }) => (
			<span className="text-[#667085] text-[14px] font-bold">
				{row?.original?.baseName}
			</span>
		),
	},
	{
		accessorKey: "reason",
		header: "Reason",
		cell: ({ row }) => (
			<span className="text-bodyTextColor text-[14px] font-normal">
				{row?.original?.reason}
			</span>
		),
	},
	{
		accessorKey: "dateTime",
		header: "Date & Time",
		cell: ({ row }) => (
			<div className="text-right text-[#667085] text-[12px] font-normal">
				{/* <span className="block">{row.original.time}</span>
				<span className="block">{row.original.date}</span> */}
			</div>
		),
	},
];

const IssuesList = ({ issues, issueCount }) => {
	const table = useReactTable({
		data: issues || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div
			className="flex flex-col max-h-[260] rounded-[5px] bg-white"
			style={{
				boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.1)",
			}}>
			<ViewAllHeader title="Issues" count={issueCount} padding="4" />
			<div className="overflow-y-auto" style={{ height: "210px" }}>
				<table className="w-full">
					<tbody>
						{table.getRowModel().rows.map((row, rowIndex) => (
							<tr
								key={row.id}
								className={rowIndex % 2 === 0 ? "bg-[#F7F7F9]" : "bg-white"}>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-4 py-1">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default IssuesList;
