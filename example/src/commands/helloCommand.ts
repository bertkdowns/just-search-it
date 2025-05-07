import { defineCommand } from "just-search-it";

const helloCommand = defineCommand<[], string>("hello");

export default helloCommand;