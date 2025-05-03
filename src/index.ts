// src/index.ts

type CommandMetadata = {
    name: string;
    description: string;
    icon: string;
}

type CommandBinding<ReturnType> = {
    metadata: CommandMetadata;
    run: () => ReturnType;
}

type CommandBindpoint<Args extends any[], ReturnType> = {
    (...args: Args): ReturnType | undefined;
    argBindings: Record<string, CommandBinding<ReturnType>>;
}

export function defineCommand<Args extends any[], ReturnType extends any>(): CommandBindpoint<Args> {

    const command: CommandBindpoint<Args,ReturnType> = Object.assign(
        (...args: Args) => {
            console.log("Executing command")
            // Use the arguments to create a unique key
            const key = args.map(arg => arg.toString()).join('.');
            // Find the command in the argBindings,
            // and run it if it exists.
            return command.argBindings[key]?.run() || undefined;
        },
        {
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

export function removeBinding<Args extends any[], ReturnType>(command: CommandBindpoint<Args, ReturnType>, key: string) {
    // Remove the function from the argBindings object
    delete command.argBindings[key];
}




