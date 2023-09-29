import FileHandlerOptions from "../Types/FileHandlerOptions";
import EventEmitter from "node:events";
import fs from "node:fs";

export default class FileHandler extends EventEmitter {
    private file: fs.WriteStream | undefined;
    private readonly maxFileSize: number;
    private currentFileSize: number = 0;
    private readonly logBelow: boolean;
    private readonly logLevel: number;
    private error: Error | undefined;
    private readonly path: string;
    private dead: boolean = false;

    constructor(path: string, options: FileHandlerOptions) {
        super();

        this.path = path;
        this.createFile();

        this.logBelow = !options.only;
        this.logLevel = options.level;
        this.maxFileSize = options.maxFileSize??Infinity;

        this.setupErrorHandling();
    }

    private setupErrorHandling(): void {
        this.file?.on('error', (err) => {
            this.error = err;
            console.error(`Error writing to ${this.path}: ${err.message}`);
            this.close();
        });
    }

    private rotateLogFile(): void {
        this.close();
        const rotatedFilePath = `${this.path}.${Date.now()}`;
        fs.renameSync(this.path, rotatedFilePath);
        this.createFile();
    }

    private createFile() {
        this.file = fs.createWriteStream(this.path, { flags: 'a' });
    }

    write(data: string): void {
        if (this.dead) return;
        if (this.currentFileSize + data.length > this.maxFileSize) {
            this.rotateLogFile();
        }
        this.file?.write(data + "\n");
        this.emit("written", data);
    }

    close(): void {
        if (this.dead) return;
        this.file?.close();
        this.file = undefined;
        this.emit("close");
    }

    getPath(): string {
        return this.path;
    }

    getFile(): fs.WriteStream | undefined {
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