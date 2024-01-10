import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import IFileHandler from '../Types/IFileHandler';
import FileHandler from './FileHandler';
import fs from "node:fs";

export default class FileHandlerWorker implements IFileHandler {
    private readonly worker: Worker;

    private readonly requestAndWait = <T>(worker: Worker, message: string) => {
        return new Promise<T>((resolve, reject) => {
            const listener = (response: any) => {
                worker.off('message', listener);
                if (response && response.error) {
                    reject(new Error(response.error));
                } else {
                    resolve(response);
                }
            };

            worker.on('message', listener);
            worker.postMessage({ action: message });
        });
    };

    constructor(private readonly fileHandler: FileHandler) {
        this.worker = new Worker(__filename, { workerData: { handler: fileHandler.toJSON() } });
        fileHandler.close();
    }

    write(data: string): void {
        this.worker.postMessage({ action: 'write', data });
    }

    close(): void {
        this.worker.postMessage({ action: 'close' });
    }

    getLevel() {
        return this.fileHandler.getLevel();
    }

    getPath(): string {
        return this.worker.threadId.toString();
    }

    getFile() {
        return this.requestAndWait<fs.WriteStream | undefined>(this.worker, "file");
    }

    getError() {
        return this.requestAndWait<Error | undefined>(this.worker, "error");
    }

    isDead() {
        return this.requestAndWait<boolean>(this.worker, "dead");
    }
}

if (!isMainThread) {
    const fileHandler = FileHandler.fromJSON(workerData.handler);

    parentPort?.on('message', (message) => {
        switch (message.action) {
            case 'write':
                fileHandler.write(message.data);
                break;
            case 'close':
                fileHandler.close();
                break;
            case "level":
                parentPort?.postMessage(fileHandler.getLevel());
                break;
            case "file":
                parentPort?.postMessage(fileHandler.getFile());
                break;
            case "dead":
                parentPort?.postMessage(fileHandler.isDead());
                break;
            case "error":
                parentPort?.postMessage(fileHandler.getError());
                break;
        }
    });
}
