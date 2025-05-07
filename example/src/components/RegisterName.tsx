import { useRegisterCommand } from "just-search-it";
import greetingCommand from "../commands/logName";

function RegisterName({name}: { name: string }) {
    useRegisterCommand(greetingCommand, {
        name: name,
        description: "Say hello",
        icon: "👋",
        group: "greeting",
    }, () => {
        console.log("Hello, " + name + "!");
        return "Hello, " + name + "!";
    }, name)


    return (
        <div>
            <p>This component registers the greeting for {name}.</p>
        </div>
    );
}
export default RegisterName;