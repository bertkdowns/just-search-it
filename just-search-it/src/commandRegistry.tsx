// This file contains registering and unregistering of multiple commands into a single
// context. 
// This code is react-specific, but maybe it could be made generic?
import { useContext, useEffect, createContext, useState, useRef } from "react";
import type { CommandBinding, CommandBindpoint, CommandMetadata } from "./commandBinding";
import {  addBinding,removeBinding, getArgKey, getCommandKey } from "./commandBinding";
import React from "react";
import { hasShortcut } from "./shortcuts";

type CommandRegistry = Record<string, CommandBinding<any>>;

const CommandContext = createContext<CommandRegistry>({});
const SetCommandContext = createContext<React.RefObject<React.Dispatch<React.SetStateAction<CommandRegistry>>>>(null!);

export function CommandProvider({children}:{children: React.ReactNode}) {
    const [commandContext, setCommandContext] = useState<CommandRegistry>({});
    const setCommandRef = useRef<React.Dispatch<React.SetStateAction<CommandRegistry>>>(setCommandContext);

    setCommandRef.current = setCommandContext;

    return (
        <CommandContext.Provider value={commandContext}>
            <SetCommandContext.Provider value={setCommandRef}>
                {children}
            </SetCommandContext.Provider>
        </CommandContext.Provider>
    )
}

export function useCommands(): CommandRegistry {
    const commandContext = useContext(CommandContext);
    return commandContext;
}

export function useSetCommands() {
    const setCommandContext = useContext(SetCommandContext);
    return setCommandContext;
}

export function useRegisterCommand<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>, metadata: CommandMetadata, fn: () => ReturnType, ...args: Args){
    const setCommandContext = useSetCommands();
    const key = addBinding(command, metadata, fn, ...args);
    const commandObject = command.argBindings[key]
    
    const commandKey =  command.key + '.' + key;

    useEffect(()=>{
        if (!setCommandContext) {
            console.error("Command context is not available. Make sure that you have wrapped this component in a CommandProvider.");
            return;
        }
        // Register the command in the context
        setCommandContext.current((prev: CommandRegistry) => ({
            ...prev,
            [command.key + '.' + key]: commandObject
        }));
        return () => {
            // Unregister the command when the component unmounts
            removeBinding(command, key);
            setCommandContext.current((prev: CommandRegistry) => {
                const newContext = { ...prev };
                delete newContext[command.key + '.' + key];
                return newContext;
            });
        }
    }, [command,setCommandContext,commandKey])
}

// A hook where you put the arguments
// in the hook and then you can call the command
export function useCommand<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>,...args: Args): ()=> (ReturnType | undefined) {
    const key = getArgKey(args);
    return ()=> command.argBindings[key]?.run() 
}


// A hook that returns a function that takes the arguments.
// This is probably better than the above one, as it's more flexible.
export function useRunCommand<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>): (...args: Args) => (ReturnType | undefined) {
    return (...args: Args) => {
        const key = getArgKey(args)
        return command.argBindings[key]?.run();
    }
}


// Used to handle the keyboard shortcuts
export function runCommandShortcut(registry: CommandRegistry, event: KeyboardEvent) {
    Object.values(registry).some((command) => {
        if(hasShortcut( event, command.metadata.shortcuts)){
            event.preventDefault();
            event.stopPropagation();
            command.run();
            return true;
        }
    })
}