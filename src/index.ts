import { constants, WriteStream, accessSync, createWriteStream } from "fs";
import PermissionException from "./classes/PermissionException";
import LoggerOptions from "./Types/LoggerOptions";
import EventEmitter from "events";
import process from "process";

export default class Logger extends EventEmitter {
    private formater: (level: string, messgae: string, timestamp?: Date) => string = (level, message) => `[${level.toUpperCase()}] ${message}`;
    private fileStream: WriteStream | undefined;
    private readonly closeOnExit: boolean;
    private readonly hideConsole: boolean;
    private readonly path: string | null;
    private dead: boolean = false;

    constructor(options?: LoggerOptions) {
        super();
        this.closeOnExit = options?.closeOnExit ? true : false;
        this.hideConsole = options?.hideConsole ? true : false;
        this.path = options?.path ? options.path : null;

        if (this.path !== null) {
            try {
                accessSync(this.path, constants.R_OK | constants.W_OK);
                this.fileStream = createWriteStream(this.path);
            } catch (e) {
                throw new PermissionException("Missing permission to access log file/location.");
            }
        }

        process.on("exit", () => {
            if (this.closeOnExit) {
                this.close();
            }
        }).on("uncaughtException", (err, origin) => {
            this.log("error", `A uncaugth error occured at: ${origin}.\nError: ${err.message}`);
        });
    }

    format(callback: (level: string, messgae: string, timestamp?: Date) => string): this {
        if (this.dead) return this;
        this.formater = callback;
        return this;
    }

    log(level: string, message: string): this {
        if (this.dead) return this;
        const res = this.formater(level, message, new Date(Date.now()));
        if (!this.hideConsole) {
            console.log(res);
        }
        if (this.path && this.fileStream) {
            this.fileStream.write(res, (err) => {
                this.emit("error", err);
            });
        }
        this.emit("log", res);
        return this;
    }

    close() {
        if (this.dead) return;
        this.dead = true;
        if (this.fileStream) this.fileStream.close();
        this.emit("close");
    }
}