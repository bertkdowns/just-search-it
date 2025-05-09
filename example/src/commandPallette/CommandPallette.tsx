"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./Dialog";
import { useCommands, type CommandBinding } from 'just-search-it';
import Fuse, { type FuseResult } from "fuse.js";


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
    keys: [
        "command.metadata.name",
        "command.metadata.description"
    ]
};


// grid grid-cols-10
const ColumnOrder = [
    "col-start-4 col-span-4",
    "col-start-1 col-span-3",
    "col-start-8 col-span-3",
]


type SearchResult = FuseResult<{
    key: string;
    command: CommandBinding<any>;
}>
type GroupedMap = Record<string, SearchResult[]>;

type GroupedResult = [string, SearchResult[]][];

export default function CommandPallette() {
    const commands = useCommands();
    const [open, setOpen] = React.useState(false);
    const [row, setRow] = React.useState(0); // how far down the list we are
    const [column, setColumn] = React.useState(1); // which column we are in. there are 3 columns, for 3 different command groups
    const numColumns = 3;
    const [searchTerm, setSearchTerm] = React.useState("");

    const commandList = Object.entries(commands)
        .map(([key, command]) => ({ key: key, command: command }))
    const filteredList = new Fuse(commandList, fuseOptions).search(searchTerm);
    // group the commands by their item.command.metadata.group
    const groupedMap: GroupedResult = Object.entries(filteredList.reduce((acc: GroupedMap, item) => {
        const group = item.item.command.metadata.group || "default";
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(item);
        return acc;
    }, {} as GroupedMap));



    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "/") {
                event.preventDefault();
                setOpen(true);
                return;
            }

            if (!open) return;
            console.log("handling keydown", event.key);

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
                const command = Object.values(commands)[row];
                console.log("Executing command:", command.metadata.name);
                if (command) {
                    command.run();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, commands, row]);

    const runCommand = React.useCallback((command: CommandBinding<any>) => {
        return () => {
            setOpen(false);
            command.run();
        }
    }, [setOpen])




    return (
        <div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger onClick={() => setOpen(!open)}>
                    {open ? "close" : "open"}
                </DialogTrigger>
                <DialogContent >
                    <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }}></input>
                    <div>
                        <DialogTitle>Search</DialogTitle>
                        <div className="grid grid-cols-10 gap-4">
                            {groupedMap.map(([group, items], index) => (
                                <div key={group} className={ColumnOrder[index % numColumns] + " row-start-"+ (1 + Math.floor(index / numColumns))}>
                                    <h2>{group}</h2>
                                    {items.map((item) => (
                                        <button key={item.item.key} onClick={runCommand(item.item.command)}>
                                            {item.item.command.metadata.name}
                                        </button>
                                    ))}
                                </div>
                            ))}

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

