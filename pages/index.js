import React from "react";
import { useTable, useBlockLayout } from "react-table";
import { Virtuoso, GroupedVirtuoso } from "react-virtuoso";

import makeData from "../makeData";

const Button = ({ children }) => {
  return (
    <button className="h-6 hover:bg-gray-100 rounded text-sm text-gray-700 px-2 focus:ring focus:outline-none font-medium">
      {children}
    </button>
  );
};

const Table = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Row Index",
        accessor: (row, i) => i,
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Age",
        accessor: "age",
        width: 50,
      },
      {
        Header: "Visits",
        accessor: "visits",
        width: 60,
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Profile Progress",
        accessor: "progress",
      },
    ],
    []
  );

  const data = React.useMemo(() => makeData(10000), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useBlockLayout);

  const RenderRow = React.useCallback(
    (index) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div {...row.getRowProps({})} className="bg-white">
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="p-1 border-b">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  return (
    <div>
      <div className="bg-white p-3 space-x-4">
        <Button>Hide fields</Button>
        <Button>Filter</Button>
        <Button>Group</Button>
        <Button>Sort</Button>
      </div>

      <div {...getTableProps()} className="block">
        <div {...getTableBodyProps()}>
          <GroupedVirtuoso
            style={{ height: "400px" }}
            groupCounts={[rows.length]}
            groupContent={() => {
              return (
                <div className="">
                  {headerGroups.map((headerGroup) => (
                    <div
                      {...headerGroup.getHeaderGroupProps()}
                      className="bg-gray-100 border-b border-gray-200"
                    >
                      {headerGroup.headers.map((column) => (
                        <div
                          {...column.getHeaderProps()}
                          className="text-sm text-gray-600 p-1"
                        >
                          {column.render("Header")}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            }}
            totalCount={rows.length}
            itemContent={RenderRow}
          />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="p-4 bg-blue-200 h-screen">
      <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
        <Table />
      </div>
    </div>
  );
}
