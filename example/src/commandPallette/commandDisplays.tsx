import type { Command } from "just-search-it";
import { groupCommands, type CommandBinding } from "just-search-it";
import { DialogClose } from "../components/ui/dialog";
import {
  Accordion, AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"


export function CommandButton({selected, commandBinding}: {
  selected?: boolean;
  commandBinding?: CommandBinding<any>;
}) {
  if (!commandBinding) {
    return null;
  }
  return (
    <DialogClose asChild>
    <button
        onClick={()=>{commandBinding.run()}}
      className={`flex flex-row items-center p-2 rounded-sm hover:bg-blue-200 w-full ${
        selected ? "bg-blue-200 shadow" : "bg-white"
      }`}
    >
      <span className="text-xl">{commandBinding.metadata.icon}</span>
        {commandBinding.metadata.name}
    </button>
    </DialogClose>
  );
}

export function CommandFeature({selected, commandBinding}: {
  selected?: boolean;
  commandBinding?: CommandBinding<any>;
}) {
  if (!commandBinding) {
    return null;
  }
  return (
    <DialogClose asChild>
    <button
        onClick={()=>{commandBinding.run()}}
      className={`flex flex-row border-1 items-center p-2 rounded-sm hover:bg-blue-200 w-full ${
        selected ? "bg-blue-200 shadow" : "bg-white"
      }`}
    >
      <span className="text-7xl">{commandBinding.metadata.icon}</span>
      <div>
        <h2 className="text-2xl">{commandBinding.metadata.name}</h2>
        <p className="text-sm text-gray-500">{commandBinding.metadata.description}</p>
      </div>
    </button>
    </DialogClose>
  );
}


export function GroupAccordion({ commands }: { commands: Command[] }) {
  const commandGroups = groupCommands(commands)
  return (
    
    <Accordion>
      {Object.entries(commandGroups).map(([group, commands]) => (
        <AccordionItem key={group} value={group}>
          <AccordionTrigger>{group}</AccordionTrigger>
          <AccordionContent>
            {commands.map((command) => (
              <CommandButton
                key={command.metadata.name}
                commandBinding={command}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function GroupTabs({ commands }: { commands: Command[] }) {
  const commandGroups = groupCommands(commands)
  return (
    <Tabs defaultValue={Object.keys(commandGroups)[0]} className="w-full">
      <TabsList className="w-full">
        {Object.entries(commandGroups).map(([group]) => (
          <TabsTrigger key={group} value={group}>
            {group}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(commandGroups).map(([group, commands]) => (
        <TabsContent key={group} value={group} className="grid  grid-cols-3 grid-rows-3 gap-4">
          {commands.map((command) => (
            <CommandButton
              key={command.metadata.name}
              commandBinding={command}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}