"use client"
 
import * as React from "react"
import { Dialog, DialogContent, DialogTrigger,DialogTitle } from "./Dialog";
import { useCommands } from './commandRegistry';

export default function CommandPallette() {
    const commands = useCommands();
    const [open, setOpen] = React.useState(false);
    return (
        <div>
        <DialogTrigger>
                {open ? "close" : "open"}
            </DialogTrigger>
        <Dialog open={true} onOpenChange={setOpen}>
            
            <DialogContent >
                <div className="bg-blue-300">
                    <DialogTitle>Search</DialogTitle>
                    hello there.
                    {Object.entries(commands).map(([key, command]) => (
                        <div key={key} onClick={() => { command.run(); }}>{command.metadata.name}</div>
                    ))}
                    
                    <div className="additional-content">
                        Additional content goes here. you can add as much or as little as you like.
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </div>
    );
}