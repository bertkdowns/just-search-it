import type { Command } from "just-search-it"
import { groupCommands } from "just-search-it"
import {
  Accordion, AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"

export function GroupAccordion({ commands }: { commands: Command[] }) {
  const commandGroups = groupCommands(commands)
  return (
    
    <Accordion>
      {Object.entries(commandGroups).map(([group, commands]) => (
        <AccordionItem key={group} value={group}>
          <AccordionTrigger>{group}</AccordionTrigger>
          <AccordionContent>
            <ul>
              {commands.map((command) => (
                <li key={command.metadata.key}>
                  {command.metadata.name}: {command.metadata.description}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}