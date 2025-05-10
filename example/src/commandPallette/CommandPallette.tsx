"use client";

import Fuse, { type FuseResult } from "fuse.js";
import {
  useCommands,
  useCommandSearch,
  type CommandBinding,
} from "just-search-it";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
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
const ColumnWidths = ["w-3/10", "w-4/10", "w-3/10"];

type SearchResult = FuseResult<{
  key: string;
  command: CommandBinding<any>;
}>;
type GroupedMap = Record<string, SearchResult[]>;

type GroupedResult = [string, SearchResult[]][];

export default function CommandPallette() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const numColumns = 3;
  const [inputRef, data, column, row] = useCommandSearch(
    numColumns,
    searchTerm,
    (command) => {
      setOpen(false);
    }
  );

  // TODO; useKeypress hook
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        setOpen(true);
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
            {searchTerm.length == 0 && <CommandBrowser />}
            <div className="flex flex-row">
              {ColumnWidths.map((colClass, index) => (
                <div key={index} className={`${colClass} p-2`}>
                  <Column
                    items={data[index]} 
                    columnIndex={index}
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
  items,
  columnIndex,
  selectedColumnIndex,
  selectedRowIndex,
}: {
  items: GroupedResult;
  columnIndex: number;
  selectedColumnIndex: number;
  selectedRowIndex: number;
}) {
  let rowIndex = 0;
  return (
    <>
      {items.map(([group, items]) => (
        <div
          key={group}
          className="p-2 border-1 border-gray-300 rounded-sm mt-2 shadow-sm"
        >
          <h2 className="text-xl text-center bold">{group}</h2>
          {items.map((item) => (
            <CommandButton
              key={item.item.key}
              selected={
                selectedRowIndex === rowIndex++ &&
                columnIndex === selectedColumnIndex
              }
              commandBinding={item.item.command}
            />
          ))}
        </div>
      ))}
    </>
  );
}
