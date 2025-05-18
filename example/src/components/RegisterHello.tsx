import { requestUserInput } from "../inputHandler/inputSystem";
import { useRegisterCommand } from "just-search-it";
import helloCommand from "../commands/helloCommand";
import { z } from "zod";
import { useState } from "react";

function RegisterHello() {
    const [name, setName] = useState("");

    useRegisterCommand(helloCommand, {
        name: "hello",
        description: "Say hello",
        icon: "👋",
        shortcuts: [{
            key: "e",
            ctrlKey: true,
        }]
    }, async () => {
        console.log("Hello, World!");
        const result = await requestUserInput("What is your name?", 
            ["Alice", "Bob", "Charlie"],
            z.string());
        setName(result)
        return "Hello, World!";
    })


    return (
        <div>
            <p>{name ? ("Hello, " + name) : ""}</p>
        </div>
    );
}
export default RegisterHello;