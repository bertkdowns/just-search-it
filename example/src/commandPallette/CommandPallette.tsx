"use client"
 
import * as React from "react"
import { Dialog, DialogContent, DialogTrigger,DialogTitle } from "./Dialog";
import { useCommands, type CommandBinding } from 'just-search-it';
import Fuse from "fuse.js";


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



export default function CommandPallette() {
    const commands = useCommands();
    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState(0);
    const [searchTerm, setSearchTerm] = React.useState("");

    const commandList = Object.entries(commands)
        .map(([key, command]) => ({key: key, command: command}))
    const filteredList = new Fuse(commandList, fuseOptions).search(searchTerm);

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
            setPosition((prev) => Math.min(prev + 1, Object.keys(commands).length - 1));
            } else if (event.key === "ArrowUp") {
            setPosition((prev) => Math.max(prev - 1, 0));
            } else if (event.key === "Enter") {
                setOpen(false);
            const command = Object.values(commands)[position];
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
    }, [open, commands, position]);

    function runCommand(command: CommandBinding<any>) {
        return () => {
            setOpen(false);
            command.run();
        }
    }


    return (
        <div>
        
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setOpen(!open)}>
                {open ? "close" : "open"}
            </DialogTrigger>
            <DialogContent >
                <input value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}}></input>
                <div>
                    <DialogTitle>Search</DialogTitle>
                    {filteredList.map(({item}, index) => (
                        <div key={item.key} onClick={runCommand(item.command)} className={index === position ? 'bg-secondary' : ''}>
                            {item.command.metadata.name}
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
        </div>
    );
}