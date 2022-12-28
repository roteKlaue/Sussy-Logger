import PermissionException from "./classes/PermissionException";
import LoggerOptions from "./Types/LoggerOptions";
import EventEmitter from "events";
import process from "process";
import fs from "fs";
import Level from "./Types/Level";

export default class Logger extends EventEmitter {
    private formater: (level: string, messgae: string, timestamp?: Date) => string = (level, message) => `[${level.toUpperCase()}] ${(message)}`;
    private readonly fileStream: fs.WriteStream | undefined;
    private readonly closeOnExit: boolean;
    private readonly hideConsole: boolean;
    private readonly path: string | null;
    private readonly append: boolean;
    private dead: boolean = false;
    private readonly levels: Level[];

    constructor(options?: LoggerOptions) {
        super();
        this.closeOnExit = options?.closeOnExit ? true : false;
        this.hideConsole = options?.hideConsole ? true : false;
        this.path = options?.path ? options.path : null;
        this.append = options?.append ? options.append : false;
        this.levels = options?.levels ? options.levels : [];

        let content = "";
        if (this.path) {
            try {
                if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, content);
                fs.accessSync(this.path, fs.constants.R_OK | fs.constants.W_OK);
                if (this.append) {
                    content = fs.readFileSync(this.path, "utf8");
                }
                this.fileStream = fs.createWriteStream(this.path);
                this.fileStream.write(content);
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
            this.fileStream.write(res + "\n", (err) => {
                if (!err) return;
                this.emit("error", err);
            });
        }
        this.emit("log", res, level, message, new Date(Date.now()));
        return this;
    }

    close() {
        if (this.dead) return;
        this.dead = true;
        if (this.fileStream) this.fileStream.close();
        this.emit("close");
    }
}