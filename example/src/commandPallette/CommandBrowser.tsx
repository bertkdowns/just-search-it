"use client";

import { useCommands } from "just-search-it";
import { GroupAccordion } from "./commandDisplays";

export function CommandBrowser() {
  const commands = useCommands();
  const commandList = Object.values(commands);

  return <div>
    Command Browser
    <GroupAccordion commands={commandList} />

  </div>
}
