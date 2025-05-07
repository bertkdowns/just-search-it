// This file contains registering and unregistering of multiple commands into a single
// context. 
// This code is react-specific, but maybe it could be made generic?
import { useContext, useEffect, createContext, useState, useRef } from "react";
import type { CommandBinding, CommandBindpoint, CommandMetadata } from "./commandBinding";
import {  addBinding,removeBinding, getArgKey, getCommandKey } from "./commandBinding";
import React from "react";

type CommandRegistry = Record<string, CommandBinding<any>>;

const CommandContext = createContext<CommandRegistry>({});
const SetCommandContext = createContext<React.Ref<React.Dispatch<React.SetStateAction<CommandRegistry>>>>(null!);

export function CommandProvider({children}){
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

export function useCommands() {
    const commandContext = useContext(CommandContext);
    return commandContext;
}

export function useSetCommands() {
    const setCommandContext = useContext(SetCommandContext);
    return setCommandContext;
}

export function useRegisterCommand<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>, metadata: CommandMetadata, fn: () => ReturnType, ...args: Args){
    const setCommandContext = useSetCommands();
    
    
    useEffect(()=>{
        const key = addBinding(command, metadata, fn, ...args);
        // Register the command in the context
        setCommandContext.current((prev: CommandRegistry) => ({
            ...prev,
            [key]: {
                metadata: metadata,
                run: fn
            }
        }));
        return () => {
            // Unregister the command when the component unmounts
            removeBinding(command, key);
            setCommandContext.current((prev: CommandRegistry) => {
                const newContext = { ...prev };
                delete newContext[key];
                return newContext;
            });
        }
    }, [command])

    const key = args.map(arg => arg.toString()).join('.');
    // Always update the command function
    command.argBindings[key].run = fn;
}

export function useCommand<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>,...args: Args): ()=> (ReturnType | undefined) {
    const key = getArgKey(args);
    return ()=> command.argBindings[key]?.run() 
}