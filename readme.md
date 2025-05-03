# just-search-it

This is a library that is designed to make everything searchable.

Built for react-like frameworks, it's designed to be used so that:

- you define the types of commands there are up front
- you register instances of those commands using hooks or equivalent.
- they are then accessible globally.

So far, it can be used as follows:

```typescript
import { defineCommand } from "just-search-it";
const launch = defineCommand();

const args = ["Firefox"];
addBinding(
  launch,
  {
    name: "Launch Firefox",
    description: "Launches the Web Browser",
    icon: "🌍",
  },
  () => {
    // Do something
    console.log("Launching Firefox");
    return "Firefox launched";
  },
  ...args
);
// This means you can now call the command with the argument "Firefox"

const result = launch("Firefox");
```


To do:

- Create the command registry.
- You're gonna need a global context with all the commands.
- Then binding a command should also register it in the global context.
- if nothing is bound to a command, it should be gone.

Note that there's a key way that the commands work:
- Metadata should not change once a command is bound. However, the function that is bound to a command can change, so that it doesn't get stale.
The reason metadat shouldn't change is because it is used to render the command in a UI. The ui only updates when the list of bound commands changes.

Implementation in react:
Gonna need a useEffect to register commands and degregister them when a component mounts/unmounts.
Gonna need some way of saying when rerender needs to happen - possibly store a list of all bound commands seperately? 

A useBind hook could maybe wrap all of this, or we could create a component.

then we just need to make a ui for searching...
