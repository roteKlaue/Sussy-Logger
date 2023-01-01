import EventEmitter from "node:events";
import fs from "node:fs";
import FileHandlerOptions from "../Types/FileHandlerOptions";

export default class FileHandler extends EventEmitter {
    private readonly path: string;
    private file: fs.WriteStream | null;
    private error: Error | undefined;
    private dead: boolean = false;
    private readonly logBelow: boolean;
    private readonly logLevel: number;

    constructor(path: string, options: FileHandlerOptions) {
        super();
        this.path = path;
        this.file = fs.createWriteStream(path);
        this.logBelow = !options.only;
        this.logLevel = options.level;
        this.file?.on('error', (err) => {
            this.error = err;
            this.file?.close();
            this.file = null;
            this.emit("error", err);
        });
    }

    write(data: string): void {
        if (this.dead) return;
        this.file?.write(data);
        this.emit("written", data);
    }

    close(): void {
        if (this.dead) return;
        this.file?.close();
        this.file = null;
        this.emit("close");
    }

    getPath(): string {
        return this.path;
    }

    getFile(): fs.WriteStream | null {
        return this.file;
    }

    getError(): Error | undefined {
        return this.error;
    }

    isDead(): boolean {
        return this.dead;
    }

    getLogBelow(): boolean {
        return this.logBelow;
    }

    getLevel(): number {
        return this.logLevel;
    }
}