import { Level } from "./Level";

declare type LoggerOptions = {
    closeOnExit?: boolean;
    hideConsole?: boolean;
    levels?: Level[],
}

export default LoggerOptions;