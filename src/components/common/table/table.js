// Table.js

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function Table({
  throwSorting,
  columns,
  data,
  pathDetail,
  defaultSorting,
  columnVisibility,
}) {
  const [sorting, setSorting] = useState(defaultSorting || []);
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  useEffect(() => {
    throwSorting(sorting);
  }, [sorting, throwSorting]);

  return (
    <table className="w-full text-black">
      <thead className="h-[50px]">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header, idx) => {
              let firstHead = idx == 0;
              let lastHead = idx == headerGroup.headers.length - 1;
              return (
                <th
                  key={header.id}
                  name={idx}
                  className={`${firstHead && "rounded-tl-md"} ${
                    lastHead && "rounded-tr-md"
                  } bg-primary text-white py-2 px-4`}
                >
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, idxTr) => {
          return (
            <tr
              key={row.id}
              className="bg-white hover:bg-hover border-b-[3px] border-b-bgColor border-grey-1"
            >
              {row.getVisibleCells().map((cell, idxTd) => {
                let lastCellLeft =
                  idxTd == 0 && idxTr == table.getRowModel().rows.length - 1;
                let lastCellRigth =
                  idxTd == row.getVisibleCells().length - 1 &&
                  idxTr == table.getRowModel().rows.length - 1;
                return (
                  <td
                    // onClick={
                    //   //console.log("row click", cell)
                    //   cell.id.includes("checkbox") || cell.id.includes("action")
                    //     ? () => {}
                    //     : () => {
                    //         router.push(`${pathDetail}/${row.original.id}`);
                    //       }
                    // }
                    key={cell.id}
                    className={`${lastCellLeft && "rounded-bl-md"} ${
                      lastCellRigth && "rounded-br-md"
                    }  text-secondaryFontColor text-sm py-4 px-4`}
                  >
                    {flexRender(
                      cell?.column?.columnDef?.cell,
                      cell?.getContext()
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
