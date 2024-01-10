import FileHandlerOptions from "../Types/FileHandlerOptions";
import IFileHandler from "../Types/IFileHandler";
import EventEmitter from "node:events";
import fs from "node:fs";

export default class FileHandler extends EventEmitter implements IFileHandler {
    private file: fs.WriteStream | undefined;
    private readonly maxFileSize: number;
    private currentFileSize: number = 0;
    private readonly logBelow: boolean;
    private readonly logLevel: number;
    private error: Error | undefined;
    private readonly path: string;
    private dead: boolean = false;

    public constructor(path: string, options: FileHandlerOptions) {
        super();

        this.path = path;
        this.createFile();

        this.logBelow = !options.only;
        this.logLevel = options.level;
        this.maxFileSize = options.maxFileSize ?? Infinity;

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

    public write(data: string): void {
        if (this.dead) return;
        if (this.currentFileSize + data.length > this.maxFileSize) {
            this.rotateLogFile();
        }
        this.file?.write(data + "\n");
        this.emit("written", data);
    }

    public close(): void {
        if (this.dead) return;
        this.file?.close();
        this.file = undefined;
        this.emit("close");
    }

    public getPath(): string {
        return this.path;
    }

    public getFile(): fs.WriteStream | undefined {
        return this.file;
    }

    public getError(): Error | undefined {
        return this.error;
    }

    public isDead(): boolean {
        return this.dead;
    }

    public getLogBelow(): boolean {
        return this.logBelow;
    }

    public getLevel(): number {
        return this.logLevel;
    }

    public toJSON(): Record<string, any> {
        return {
            path: this.path,
            maxFileSize: this.maxFileSize,
            currentFileSize: this.currentFileSize,
            logBelow: this.logBelow,
            logLevel: this.logLevel,
            error: this.error ? this.error.message : undefined,
            dead: this.dead,
        };
    }

    public static fromJSON(json: Record<string, any>): FileHandler {
        const fileHandler = new FileHandler(json.path, {
            only: !json.logBelow,
            level: json.logLevel,
            maxFileSize: json.maxFileSize,
        });

        fileHandler.currentFileSize = json.currentFileSize;
        fileHandler.error = json.error ? new Error(json.error) : undefined;
        fileHandler.dead = json.dead;

        return fileHandler;
    }
}