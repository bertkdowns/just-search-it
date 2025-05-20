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


// grid grid-cols-10
const ColumnWidths = ["w-3/10", "w-4/10", "w-3/10"];

type SearchResult = FuseResult<{
  key: string;
  command: CommandBinding<any>;
}>;

type GroupedResult = [string, SearchResult[]][];

export default function CommandPallette() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const numColumns = 3;
  const [inputRef, featured, data, selected] = useCommandSearch(
    numColumns,
    searchTerm,
    open,
    (command) => {
      setOpen(false);
      setSearchTerm("");
    }
  );

  // TODO; useKeypress hook
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target?.nodeName != "INPUT" && event.target?.nodeName != "TEXTAREA") {
        if (event.key === "/") {
          event.preventDefault();
          setOpen(true);
          return;
        }
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
        <DialogTrigger onClick={() => setOpen(!open)} className="p-2 rounded-md bg-gray-200 w-100 cursor-pointer">
          {open ? "close" : "search"}
        </DialogTrigger>
        <DialogContent className="w-[80vw]" aria-description="Search for commands">
          <input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          ></input>
          <div>
            <DialogTitle className="hidden">Search</DialogTitle>
            {searchTerm.length == 0 && <CommandBrowser />}
            <div className="max-w-[600px] mx-auto">
            <Column
              items={featured}
              selected={selected}
            />
            </div>
            {data[0].length != 0 &&(
              <h2 className="text-xl text-center pt-4">More Results</h2>
            )}
            <div className="flex flex-row">
              {ColumnWidths.map((colClass, index) => (
                data[index].length == 0 ? null : (
                <div key={index} className={`${colClass} p-2 grow`}>
                  <Column
                    items={data[index]} 
                    selected={selected}
                  />
                </div>
                )
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
  selected
}: {
  items: GroupedResult;
  selected?: CommandBinding<any>;
}) {
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
              selected={item.item.command === selected}
              commandBinding={item.item.command}
            />
          ))}
        </div>
      ))}
    </>
  );
}
