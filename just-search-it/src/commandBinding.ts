import { Shortcut } from "./shortcuts";
// This file handles creating a single command.

export type CommandMetadata = {
    name: string;
    description: string;
    group?: string;
    icon: string | React.ReactNode;
    shortcuts?: Shortcut[];
}

export type CommandBinding<ReturnType> = {
    metadata: CommandMetadata;
    run: () => ReturnType;
}

export type Command = CommandBinding<any>

export type CommandBindpoint<Args extends any[], ReturnType> = {
    (...args: Args): ReturnType | undefined;
    key: string; // globally unique key for the command namespace. combined with the command subkeys to get everything.
    argBindings: Record<string, CommandBinding<ReturnType>>;
}

export type CommandType<Args extends any[], ReturnType> = CommandBindpoint<Args, ReturnType> 

export function getCommandKey<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>, ...args: Args): string {
    return command.key + '.' + getArgKey(args);
}
export function getArgKey<Args extends any[]>(args: Args): string {
    return args.map(arg => arg.toString()).join('.');
}

export function defineCommand<Args extends any[], ReturnType extends any>(key:string): CommandBindpoint<Args,ReturnType> {

    const command: CommandBindpoint<Args,ReturnType> = Object.assign(
        (...args: Args) => {
            // Use the arguments to create a unique key
            const key = getArgKey(args);
            // Find the command in the argBindings,
            // and run it if it exists.
            return command.argBindings[key]?.run() || undefined;
        },
        {
            key: key,
            argBindings: {} as Record<string, CommandBinding<ReturnType>>
        }
    )

    return command;
}

export function addBinding<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>, metadata: CommandMetadata, fn: () => ReturnType, ...args: Args): string {
    
    // Use the arguments to create a unique key
    const key = args.map(arg => arg.toString()).join('.');
    // Store the function in the argBindings object
    command.argBindings[key] = { metadata: metadata, run: fn };
    return key;
}
export function updateBinding<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>, metadata: CommandMetadata, fn: () => ReturnType, ...args: Args): string {
    
    // Use the arguments to create a unique key
    const key = args.map(arg => arg.toString()).join('.');
    // Store the function in the argBindings object
    if (command.argBindings[key]) {
        const binding = command.argBindings[key];
        command.argBindings[key].run = fn;
        // In theory, the metadata should be the same, and shouldn't be updated.
        // So, we'll throw a warning if it is different.
        if (binding.metadata.name !== metadata.name || binding.metadata.description !== metadata.description) {
            console.warn(`Command ${command.key} already has a binding for ${key}. The previous command doesn't appear to have been un-registered. This is a bug.`);
        }
    } else {
        // Command doesn't exist, so don't do anything. When the command is added, the function will be added.
    }
    return key;
}

export function removeBinding<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>, key: string) {
    // Remove the function from the argBindings object
    delete command.argBindings[key];
}




