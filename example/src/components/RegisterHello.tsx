import { useInputRequest, useRegisterCommand } from "just-search-it";
import helloCommand from "../commands/helloCommand";
import { z } from "zod";
import { useState } from "react";

function RegisterHello() {
    const [name, setName] = useState("");
    const inputRequest = useInputRequest();

    useRegisterCommand(helloCommand, {
        name: "hello",
        description: "Say hello",
        icon: "👋",
        shortcuts: [{
            key: "e",
            ctrlKey: true,
        }]
    }, () => {
        console.log("Hello, World!");
        (async () => {
            const result = await inputRequest("What is your name?", 
                ["Alice", "Bob", "Charlie"],
                z.string());
            setName(result)
        } )();
        return "Hello, World!";
    })


    return (
        <div>
            <p>{name ? ("Hello, " + name) : ""}</p>
        </div>
    );
}
export default RegisterHello;