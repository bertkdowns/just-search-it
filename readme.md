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
    shortcuts: [{key: "f",ctrlKey:true}]
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

### Publishing

How to publish the package:

```bash
# go into the just-search-it subdirectory, we don't want to publish the example, only the library
cd just-search-it
npm install # Install all dependencies
npm run build # build with tsup
npm version patch # or major, or minor - bumps the version number
npm login
npm publish
```

### Running the example

```bash
cd example
npm install
npm run dev
```

### Running the tests

```bash
cd example
npx playwright test
```

```bash
cd just-search-it
npm run test
```


### Input


TODO: document this properly.

```
await InputRequest("Choose a country",options: [
  "USA"
  "China"
  "UK"
],type: string | enum | number | url // if type is string or number the options are just suggestions.
)
```


# To Do


### MCP/LLM

Add MCP support, or DIY it. a LLM can choose from the list of commands, and then InputRequest can be used to prompt the LLM for inputs one at a time.

I'm guessing we're gonna be running a MCP server client side, or something like that, because we have to dynamically change which actions are avaliable. We're gonna have to figure out how that works.

Actually, MCP servers might be too much. we just need to understand how tooling works. (though maybe being able to work with MCP servers so the LLM can access both the commands and other MCP commands might be even better - e.g so an LLM can outsource some computation, and then run a command on the result.)

When you type something in the search bar, if there's no results, it's considered a LLM prompt when you hit enter.

