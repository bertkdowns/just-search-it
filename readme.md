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

### Shortcuts

Handle keyboard shortcuts like our platform does. Add keycommands to the commandMetadata, and update the ui to show them. Make it easy to make a UI for that too.

### Input

Handle input. This isn't actually dependent on the command library, but it would be nice to at least have an example.


```
await InputRequest("Choose a country",options: [
  "USA"
  "China"
  "UK"
],type: string | enum | number | url // if type is string or number the options are just suggestions.
)
```

We can handle all the filtering of options, and validating of types. maybe using a library like yup or that MCP one. 

Because it's await, you can chain these easily. if the user presses escape that can throw an error, and you can try-catch that.


### MCP/LLM

Finally, add MCP support, or DIY it. a LLM can choose from the list of commands, and then InputRequest can be used to prompt the LLM for inputs one at a time.

I'm guessing we're gonna be running a MCP server client side, or something like that, because we have to dynamically change which actions are avaliable. We're gonna have to figure out how that works.

Actually, MCP servers might be too much. we just need to understand how tooling works. (though maybe being able to work with MCP servers so the LLM can access both the commands and other MCP commands might be even better - e.g so an LLM can outsource some computation, and then run a command on the result.)

When you type something in the search bar, if there's no results, it's considered a LLM prompt when you hit enter.

### NPM

Gotta publish this to NPM, and also add it to the platform.


