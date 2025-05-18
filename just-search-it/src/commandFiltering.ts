import type { Command, CommandBinding, CommandType } from "./commandBinding";

export function groupCommands(commands: Command[]) {
  const grouped: Record<string, Command[]> = {};

  commands.forEach((command) => {
    const group = command.metadata.group || "default";
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(command);
  });

  return grouped;
}


export function extractGroup(commands: Command[], groupKey: string): [Command[], Command[]] {
  const filteredCommands = commands.filter(command => command.metadata.group === groupKey);
  const restCommands = commands.filter(command => command.metadata.group !== groupKey);
  return [filteredCommands, restCommands] as const;
}


export function extractType<Args extends any[],ReturnType>(commands: Command[], commandtype: CommandType<Args,ReturnType>): [
  CommandBinding<ReturnType>[],
  Command[]
] {
  const items: CommandBinding<ReturnType>[] =  [] 
  const rest = [...commands];
  
  Object.values(commandtype.argBindings).forEach((command) => {
    const itemIndex = rest.findIndex((item) => item === command);
    if (itemIndex !== -1) {
      items.push(command);
      rest.splice(itemIndex, 1);
    }
  })
  return [items, rest] as const;
}

