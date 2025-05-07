"use client"
 
import * as React from "react"
import { Dialog, DialogContent, DialogTrigger,DialogTitle } from "./Dialog";
import { useCommands } from 'just-search-it';

export default function CommandPallette() {
    const commands = useCommands();
    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState(0);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!open) return;
            console.log("handling keydown", event.key);

            if (event.key === "ArrowDown") {
                setPosition((prev) => Math.min(prev + 1, Object.keys(commands).length - 1));
            } else if (event.key === "ArrowUp") {
                setPosition((prev) => Math.max(prev - 1, 0));
            } else if (event.key === "Enter") {
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
    return (
        <div>
        
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setOpen(!open)}>
                {open ? "close" : "open"}
            </DialogTrigger>
            <DialogContent >
                <div>
                    <DialogTitle>Search</DialogTitle>
                    {Object.entries(commands).map(([key, command], index) => (
                        <div key={key} onClick={() => { command.run(); }} className={index === position ? 'bg-secondary' : ''}>
                            {command.metadata.name}
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
        </div>
    );
}