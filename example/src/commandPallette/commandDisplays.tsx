import type { Command } from "just-search-it";
import { groupCommands, type CommandBinding } from "just-search-it";
import { DialogClose } from "../components/ui/dialog";
import {
  Accordion, AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";



export function CommandButton({selected, commandBinding}: {
  selected?: boolean;
  commandBinding: CommandBinding<any>;
}) {
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
                key={command.metadata.key}
                commandBinding={command}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

