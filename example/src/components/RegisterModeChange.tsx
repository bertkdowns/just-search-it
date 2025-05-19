import { requestUserInput } from "../inputHandler/inputSystem";
import { defineCommand, useRegisterCommand } from "just-search-it";
import { z } from "zod";
import { useState } from "react";


const modeCommand = defineCommand<[boolean], void>("mode");
// This is to check that the registered commands change when the component changes.

function RegisterModeChange() {
    const [mode, setMode] = useState(true)

    useRegisterCommand(modeCommand, {
        name: (mode ? "dark" : "light") + " mode",
        description: "Toggle mode to " + (mode ? "dark" : "light"),
        icon: "🌙",
        shortcuts: [{
            key: "o",
            ctrlKey: true,
        }]
    }, () => {
        setMode(!mode)
        return "Hello, World!";
    }, mode)


    return (
        <div>
            <p>{mode ? "Light Mode" : "Dark Mode"}</p>
        </div>
    );
}
export default RegisterModeChange;