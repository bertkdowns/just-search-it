import { defineCommand } from "just-search-it";

const helloCommand = defineCommand<[], Promise<string>>("hello");

export default helloCommand;