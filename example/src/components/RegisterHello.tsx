import { useInputRequest, useRegisterCommand } from "just-search-it";
import helloCommand from "../commands/helloCommand";
import { z } from "zod";

function RegisterHello() {
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
            console.log(result);
        } )();
        return "Hello, World!";
    })


    return (
        <div>
            <p>This component registers the "hello" command.</p>
        </div>
    );
}
export default RegisterHello;