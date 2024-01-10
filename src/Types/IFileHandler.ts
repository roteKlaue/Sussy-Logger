import { PromiseOr } from "sussy-util";
import { WriteStream } from "node:fs";

export default interface IFileHandler {
    getFile(): PromiseOr<WriteStream | undefined>;
    getError(): PromiseOr<Error | undefined>;
    getLevel(): PromiseOr<number>;
    getPath(): PromiseOr<string>;
    isDead(): PromiseOr<boolean>;
    write(data: string): void;
    close(): void;
}