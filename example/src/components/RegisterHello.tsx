import { useRegisterCommand } from "just-search-it";
import helloCommand from "../commands/helloCommand";

function RegisterHello() {
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
        return "Hello, World!";
    })


    return (
        <div>
            <p>This component registers the "hello" command.</p>
        </div>
    );
}
export default RegisterHello;