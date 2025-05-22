import { requestUserInput } from "../inputHandler/inputSystem";
import { useRegisterCommand, defineCommand } from "just-search-it";
import helloCommand from "../commands/helloCommand";
import { z } from "zod";
import { useState } from "react";

const stateUpdates = defineCommand<[], void>("stateUpdates");


// This is to check that the registered commands change when the component changes.
// So when you run the command State Updates, it will copy the current state of the count
// into the commandCount state variable. This is to check that the command is actually
// using the latest state of the component, and not a stale version of the state.
export function TestStateUpdates(){
  const [count, setCount] = useState(0);
  const [commandCount, setCommandCount] = useState(0);

  
  useRegisterCommand(stateUpdates, {
    name: "stateUpdates",
    description: "State Updates",
    icon: "🔄",
    shortcuts: [{
      key: "u",
      ctrlKey: true,
    }]
  }, () => {
    setCommandCount(count);
    return "State Updates";
  })

  return (
    <div>
      <p>Count: {count}</p>
      <p>Command Copy: {commandCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )


}