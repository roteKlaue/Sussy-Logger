import FileHandlerOptions from "../Types/FileHandlerOptions";
import EventEmitter from "node:events";
import fs from "node:fs";

export default class FileHandler extends EventEmitter {
    private file: fs.WriteStream | null;
    private readonly logBelow: boolean;
    private readonly logLevel: number;
    private error: Error | undefined;
    private readonly path: string;
    private dead: boolean = false;

    constructor(path: string, options: FileHandlerOptions) {
        super();

        this.path = path;
        this.file = fs.createWriteStream(path);

        this.logBelow = !options.only;
        this.logLevel = options.level;

        this.file?.on('error', this.handleError.bind(this));
    }

    write(data: string): void {
        if (this.dead) return;
        this.file?.write(data + "\n");
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

    private handleError(err: Error) {
        this.error = err;
        this.close();
        this.emit("error", err);
    }
}