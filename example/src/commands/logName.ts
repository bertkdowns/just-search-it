import { defineCommand } from "just-search-it";

const logNameCommand = defineCommand<[string], string>("logName");

export default logNameCommand;