import Colors from "./Color";

declare type Level = {
    name: string;
    level: number;
    color?: Colors;
}

const Levels = {
    error: { name: "error", color: Colors.red, level: 1 } as Level,
    info: { name: "info", color: Colors.white, level: 4 } as Level,
    log: { name: "log", color: Colors.white, level: 3 } as Level,
    warn: { name: "warn", color: Colors.brightRed, level: 2 } as Level,
    success: { name: "success", color: Colors.green, level: 5 } as Level,
}

export {
    Level,
    Levels
};