import Fuse, { type FuseResult } from "fuse.js";
import { useCommands, runCommandShortcut } from "./commandRegistry";
import { CommandBinding } from "./commandBinding";
import * as React from "react";

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
  keys: ["command.metadata.name", "command.metadata.description","command.metadata.group"],
};

// grid grid-cols-10
const ColumnWidths = ["w-3/10", "w-4/10", "w-3/10"];

export type SearchResult = FuseResult<{
  key: string;
  command: CommandBinding<any>;
}>;
type GroupedMap = Record<string, SearchResult[]>;

export type GroupedResult = [string, SearchResult[]][]; // array of tuples of group name and search results

export function useCommandSearch(
  numColumns: number,
  searchTerm: string,
  open: boolean,
  onCommandSelect: (command: CommandBinding<any>) => void
): [
  inputRef: React.RefObject<HTMLInputElement | null>,
  featuredCommands: GroupedResult,
  groupedCommands: GroupedResult[], // array of columns, each column is a grouped result
  selectedCommand: CommandBinding<any> | undefined, // the currently selected command
] {
  const commands = useCommands();
  const [rowIndex, setRow] = React.useState(0); // how far down the list we are
  const [columnIndex, setColumn] = React.useState(0); // which column we are in. there are 3 columns, for 3 different command groups
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

  // The first two groups are the "featured" commands, and are shown  above the rest, with no columns.
  const featured = groupedMap.slice(0,2);

  // The remainder of the commands are shown in columns.
  const rest = groupedMap.slice(2);
  const columns = Array(numColumns)
    .fill(0)
    .map((_, col) => rest.filter((_, i) => i % numColumns === col));

  const selected = findSelectedCommand(
    featured,
    columns,
    rowIndex,
    columnIndex
  );

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;  // ignore repeated keydown events (from long-press)
      runCommandShortcut(commands, event);
      if(!open) return;
      if (event.key === "ArrowDown") {
        setRow((prev) => Math.min(prev + 1, Object.keys(commands).length - 1));
      } else if (event.key === "ArrowUp") {
        setRow((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "ArrowLeft") {
        setColumn((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "ArrowRight") {
        setColumn((prev) => Math.min(prev + 1, numColumns - 1));
      } else if (event.key === "Enter") {
        if (selected) {
          onCommandSelect(selected);
          setColumn(0);
          setRow(0);
          selected?.run();
        }
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
  }, [open, commands,groupedMap,setRow,setColumn, selected]);

  return [inputRef, featured, columns, selected] as const;
}


function findSelectedCommand(
  featuredCommands: [string, SearchResult[]][],// array of tuples of group name and search results
  groupedCommands: [string, SearchResult[]][][], // array of columns, each column is an array of tuples of group name and search results
  rowIndex: number,
  columnIndex: number
) : CommandBinding<any> | undefined {
  // Find the selected command.
  let currentRowIndex = 0;
  
  for (const [group_name, group] of featuredCommands){
    for (const item of group){
      if (currentRowIndex === rowIndex) {
        return item.item.command;
      }
      currentRowIndex++;
    }
  }
  for (const [group_name, group] of groupedCommands[columnIndex]) {
    for (const item of group) {
      if (currentRowIndex === rowIndex) {
        return item.item.command;
      }
      currentRowIndex++;
    }
  }
}