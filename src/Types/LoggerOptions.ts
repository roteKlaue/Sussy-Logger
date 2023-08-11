import { Level } from "./Level";

declare type LoggerOptions = {
    closeOnExit?: boolean;
    hideConsole?: boolean;
    levels?: Level[];
    customConsole?: Console;
}

export default LoggerOptions;