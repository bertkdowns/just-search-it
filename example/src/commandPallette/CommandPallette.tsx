"use client";

import Fuse, { type FuseResult } from "fuse.js";
import { useCommands, type CommandBinding } from "just-search-it";
import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { CommandBrowser } from "./CommandBrowser";
import { CommandButton } from "./commandDisplays";

const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // ignoreDiacritics: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ["command.metadata.name", "command.metadata.description"],
};

// grid grid-cols-10
const ColumnWidths = [
  "w-3/10",
  "w-4/10",
  "w-3/10",
];

type SearchResult = FuseResult<{
  key: string;
  command: CommandBinding<any>;
}>;
type GroupedMap = Record<string, SearchResult[]>;

type GroupedResult = [string, SearchResult[]][];

export default function CommandPallette() {
  const commands = useCommands();
  const [open, setOpen] = React.useState(false);
  const [row, setRow] = React.useState(0); // how far down the list we are
  const [column, setColumn] = React.useState(1); // which column we are in. there are 3 columns, for 3 different command groups
  const numColumns = 3;
  const [searchTerm, setSearchTerm] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commandList = Object.entries(commands).map(([key, command]) => ({
    key: key,
    command: command,
  }));
  const filteredList = new Fuse(commandList, fuseOptions).search(searchTerm);
  // group the commands by their item.command.metadata.group
  const groupedMap: GroupedResult = Object.entries(
    filteredList.reduce((acc: GroupedMap, item) => {
      const group = item.item.command.metadata.group || "default";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    }, {} as GroupedMap)
  );

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (!open) return;
      if (event.key === "ArrowDown") {
        setRow((prev) => Math.min(prev + 1, Object.keys(commands).length - 1));
      } else if (event.key === "ArrowUp") {
        setRow((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "ArrowLeft") {
        setColumn((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "ArrowRight") {
        setColumn((prev) => Math.min(prev + 1, numColumns - 1));
      } else if (event.key === "Enter") {
        setOpen(false);
        let rowIndex = 0;
        groupedMap.filter((_, i) => i % numColumns === column).forEach(([, items]) => {
          items.forEach((item) => {
            if (rowIndex++ === row) {
              item.item.command.run();
            }
          });
        })
      } else {
        // Refocus the input field so that the user can type again.
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, commands, row]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setOpen(!open)}>
          {open ? "close" : "open"}
        </DialogTrigger>
        <DialogContent className="w-[80vw]">
          <input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          ></input>
          <div>
            <DialogTitle>Search</DialogTitle>
            {
              searchTerm.length == 0 && <CommandBrowser/>
            }
            <div className="flex flex-row">
              {ColumnWidths.map((colClass, index) => (
                <div
                  key={index}
                  className={`${colClass} p-2`}
                >
                  <Column
                    groupedMap={groupedMap}
                    columnIndex={index}
                    numColumns={numColumns}
                    selectedColumnIndex={column}
                    selectedRowIndex={row}
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Column({
  groupedMap,
  columnIndex,
  numColumns,
  selectedColumnIndex,
  selectedRowIndex,
}: {
  groupedMap: GroupedResult;
  columnIndex: number;
  numColumns: number;
  selectedColumnIndex: number;
  selectedRowIndex: number;
}) {
  const items = groupedMap.filter((_, i) => i % numColumns === columnIndex);

  let rowIndex = 0;
  return (
    <>
      {items.map(([group, items], index) => (
        <div
          key={group}
          className="p-2 border-1 border-gray-300 rounded-sm mt-2 shadow-sm"
        >
          <h2 className="text-xl text-center bold">{group}</h2>
          {items.map((item) => (
            <CommandButton
              key={item.item.key}
              selected={selectedRowIndex === rowIndex++ && columnIndex === selectedColumnIndex}
              commandBinding={item.item.command}
            />
          ))}
        </div>
      ))}
    </>
  );
}





