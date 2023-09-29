import LoggerOptions from "../Types/LoggerOptions";
import { Level, Levels } from "../Types/Level";
import FileHandler from "./FileHandler";
import { deepClone } from "sussy-util";
import Colors from "../Types/Color";
import EventEmitter from "events";
import process from "process";

export default class Logger extends EventEmitter {
    private formaterFile: (level: Level, message: string, timestamp?: Date) => string;
    private formaterConsole: (level: Level, message: string, timestamp?: Date) => string;
    private readonly fileHandlers: FileHandler[][] = [[], [], [], [], []];
    private readonly customConsole: Console;
    private readonly closeOnExit: boolean;
    private readonly hideConsole: boolean;

    public constructor(options?: LoggerOptions) {
        super();
        
        this.closeOnExit = options?.closeOnExit || true;
        this.hideConsole = options?.hideConsole || false;
        this.customConsole = options?.customConsole || deepClone(console) as Console; 

        this.formaterFile = this.defaultFileFormatter;
        this.formaterConsole = this.defaultConsoleFormatter;

        process.on("exit", this.handleExit.bind(this));
        process.on("uncaughtException", this.handleUncaughtException.bind(this));
    }

    public format(callback: (level: Level, message: string, timestamp?: Date) => string): this {
        this.formaterFile = callback;
        this.formaterConsole = callback;
        return this;
    }

    public formatConsole(callback: (level: Level, messgae: string, timestamp?: Date) => string): this {
        this.formaterConsole = callback;
        return this;
    }

    public formatFile(callback: (level: Level, messgae: string, timestamp?: Date) => string): this {
        this.formaterFile = callback;
        return this;
    }

    public log(level: Level, message: string): this {
        if (level.level <= Levels.none.level) {
            throw new Error("Invalid log level.");
        }

        const res1 = this.formaterConsole(level, message, new Date(Date.now()));
        const res2 = this.formaterFile(level, message, new Date(Date.now()));
        if (!this.hideConsole) {
            this.customConsole.log(res1);
        }
        this.fileHandlers[level.level - 1].forEach(e => e.write(res2));    
        this.emit("log", res1, res2, level, message, new Date(Date.now()));
        return this;
    }

    public attachFileHandler(handler: FileHandler): this {
        const level = handler.getLevel() - 1;
        if (!handler.getLogBelow()) {
            this.fileHandlers[level].push(handler);
            return this;
        }

        for (let i = level; i >= 0; i--) {
            this.fileHandlers[i].push(handler);
        }

        return this;
    }

    private defaultFileFormatter(level: Level, message: string, timestamp?: Date): string {
        return `[${level.name.toUpperCase()}] ${message}`;
    }

    private defaultConsoleFormatter(level: Level, message: string, timestamp?: Date): string {
        const color = level.color || Colors.reset;
        return `[${level.name.toUpperCase()}] ${color}${message}${Colors.reset}`;
    }

    private handleExit() {
        if (this.closeOnExit) {
            this.closeFileHandlers();
        }
    }

    private handleUncaughtException(err: Error, origin: string) {
        this.log(Levels.error, `An uncaught error occurred at: ${origin}.\nError: ${err.message}`);
    }

    private closeFileHandlers() {
        this.fileHandlers.forEach(handlers => handlers.forEach(handler => handler.close()));
    }
}
