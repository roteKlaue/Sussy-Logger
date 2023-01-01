import Colors from "./Color";

declare type Level = {
    name: string;
    level: number;
    color?: Colors;
}

const Levels = {
    error: { name: "error", color: Colors.red, level: 1 } as Level,
    info: { name: "info", color: Colors.red, level: 4 } as Level,
    log: { name: "log", color: Colors.red, level: 3 } as Level,
    warn: { name: "warn", color: Colors.red, level: 2 } as Level,
    success: { name: "success", color: Colors.red, level: 5 } as Level,
}

export {
    Level,
    Levels
};