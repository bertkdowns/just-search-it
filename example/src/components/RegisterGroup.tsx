import { useRegisterCommand } from "just-search-it";
import greetingCommand from "../commands/logName";
import { defineCommand } from "just-search-it";

const groupCommand = defineCommand<[string, string], string>("groupCommand");


function RegisterGroup({group}: { group: string }) {
    useRegisterCommand(groupCommand, {
        name: "Command 1",
        description: "This is a test command",
        icon: "👋",
        group: group,
    }, () => {
        console.log("Running command 1 from group " + group);
        return ""
    }, group, "command1")

    useRegisterCommand(groupCommand, {
        name: "Command 1",
        description: "This is a test command",
        icon: "👋",
        group: group,
    }, () => {
        console.log("Running command 2 from group " + group);
        return ""
    },group, "command2")

    useRegisterCommand(groupCommand, {
        name: "Command 3",
        description: "This is a test command",
        icon: "👋",
        group: group,
    }, () => {
        console.log("Running command 3 from group " + group);
        return ""
    },group,  "command3")


    return (
        <div>
            <p>This component registers a bunch of commands for {group}.</p>
        </div>
    );
}
export default RegisterGroup;