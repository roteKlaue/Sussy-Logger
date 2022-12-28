import Level from "./Level";

declare type LoggerOptions = {
    closeOnExit?: boolean;
    path?: string;
    append?: boolean;
    hideConsole?: boolean;
    levels?: Level[],
}

export default LoggerOptions;