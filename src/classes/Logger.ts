import { deepClone } from "sussyutilbyraphaelbader";
import LoggerOptions from "../Types/LoggerOptions";
import { Level, Levels } from "../Types/Level";
import FileHandler from "./FileHandler";
import EventEmitter from "events";
import process from "process";
import Colors from "../Types/Color";

export default class Logger extends EventEmitter {
    private formaterFile: (level: Level, messgae: string, timestamp?: Date) => string = (level, message) => `[${level.name.toUpperCase()}] ${(message)}`;
    private formaterConsole: (level: Level, messgae: string, timestamp?: Date) => string = (level, message) => `[${level.name.toUpperCase()}] ${level.color?level.color: Colors.reset}${message}${Colors.reset}`;
    private readonly fileHandlers: Array<Array<FileHandler>> = [[], [], [], [], []];
    private readonly customConsole: Console = deepClone(console) as Console;
    private readonly closeOnExit: boolean;
    private readonly hideConsole: boolean;
    private readonly levels: Level[];

    constructor(options?: LoggerOptions) {
        super();
        this.closeOnExit = options?.closeOnExit ? true : false;
        this.hideConsole = options?.hideConsole ? true : false;
        this.levels = options?.levels ? options.levels : [];

        process.on("exit", () => {
            if (this.closeOnExit) {
                this.fileHandlers.forEach(el => el.forEach(e => e.close()));
            }
        }).on("uncaughtException", (err, origin) => {
            this.log(Levels.error, `A uncaugth error occured at: ${origin}.\nError: ${err.message}`);
        });
    }

    format(callback: (level: Level, messgae: string, timestamp?: Date) => string): this {
        this.formaterFile = callback;
        this.formaterConsole = callback;
        return this;
    }

    formatConsole(callback: (level: Level, messgae: string, timestamp?: Date) => string): this {
        this.formaterConsole = callback;
        return this;
    }

    formatFile(callback: (level: Level, messgae: string, timestamp?: Date) => string): this {
        this.formaterFile = callback;
        return this;
    }

    log(level: Level, message: string): this {
        const res1 = this.formaterFile(level, message, new Date(Date.now()));
        const res2 = this.formaterConsole(level, message, new Date(Date.now()));
        if (!this.hideConsole) {
            this.customConsole.log(res1);
        }
        this.fileHandlers[level.level - 1].forEach(e => e.write(res2));    
        this.emit("log", res1, res2, level, message, new Date(Date.now()));
        return this;
    }

    attachFileHandler(handler: FileHandler): this {
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
}