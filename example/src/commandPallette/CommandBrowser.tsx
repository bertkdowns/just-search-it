"use client";

import { useCommands, extractCommand } from "just-search-it";
import { CommandFeature, GroupAccordion, GroupTabs } from "./commandDisplays";

export function CommandBrowser() {
  const commands = useCommands();
  const commandList = Object.values(commands);

  const helloCommand = commands["hello."]
  const helloJane = commands["logName.Jane Doe"]
  return <div>
    Command Browser
    <div className="flex flex-row py-2 gap-4">
    <CommandFeature commandBinding={helloCommand} />
    <CommandFeature commandBinding={helloJane} />
    </div>
    <GroupTabs commands={commandList} />
    <GroupAccordion commands={commandList} />

  </div>
}
