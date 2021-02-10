import React from "react";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from "react-table";
import { GroupedVirtuoso } from "react-virtuoso";
import { FiArrowDown, FiArrowUp, FiChevronDown } from "react-icons/fi";
import { Popover } from "react-tiny-popover";
import { useMenuState, Menu, MenuItem } from "reakit/Menu";

import makeData from "../makeData";

const TableHeaderPopover = () => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const menu = useMenuState();
  const ref = React.useRef();

  React.useEffect(() => {
    if (isPopoverOpen) {
      menu.first();
    }
  }, [isPopoverOpen]);

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["bottom"]}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={
        <Menu
          {...menu}
          className="bg-gray-900 text-white rounded w-36"
          aria-label="Header options"
          visible
        >
          <MenuItem
            ref={ref}
            className="block hover:bg-gray-800 text-sm py-2 px-3 w-full focus:outline-none focus:ring text-left"
            {...menu}
          >
            Sort A to Z
          </MenuItem>
          <MenuItem
            className="block hover:bg-gray-800 text-sm py-2 px-3 w-full focus:outline-none focus:ring text-left"
            {...menu}
          >
            Sort Z to A
          </MenuItem>
          <MenuItem
            className="block hover:bg-gray-800 text-sm py-2 px-3 w-full focus:outline-none focus:ring text-left"
            {...menu}
          >
            Add Filter
          </MenuItem>
          <MenuItem
            className="block hover:bg-gray-800 text-sm py-2 px-3 w-full focus:outline-none focus:ring text-left"
            {...menu}
          >
            Hide Field
          </MenuItem>
        </Menu>
      }
    >
      <button
        className="text-gray-400 hover:text-gray-900"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      >
        <FiChevronDown />
      </button>
    </Popover>
  );
};

const Button = ({ children }) => {
  return (
    <button className="h-6 hover:bg-gray-100 rounded text-sm text-gray-700 px-2 focus:ring focus:outline-none font-medium">
      {children}
    </button>
  );
};

const TableHeader = ({ column }) => {
  return (
    <div
      {...column.getHeaderProps()}
      className="text-sm text-gray-600 px-2 py-1 relative"
    >
      <div className="flex items-center justify-between mr-2">
        <div
          className="flex items-center space-x-2"
          {...column.getSortByToggleProps()}
        >
          <span>{column.render("Header")}</span>
          <span>
            {column.isSorted ? (
              column.isSortedDesc ? (
                <FiArrowDown />
              ) : (
                <FiArrowUp />
              )
            ) : (
              ""
            )}
          </span>
        </div>
        <TableHeaderPopover />
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 h-full w-2 hover:bg-blue-700"
        {...column.getResizerProps()}
      ></div>
    </div>
  );
};

const Table = () => {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

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
      },
      {
        Header: "Visits",
        accessor: "visits",
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
  } = useTable(
    { columns, data, defaultColumn },
    useBlockLayout,
    useResizeColumns,
    useSortBy
  );

  const RenderRow = React.useCallback(
    (index) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div {...row.getRowProps({})} className="bg-white">
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="px-2 py-1 border-b">
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
                      className="bg-gray-100 border-t border-b border-gray-200"
                    >
                      {headerGroup.headers.map((column, index) => {
                        return <TableHeader key={index} column={column} />;
                      })}
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
