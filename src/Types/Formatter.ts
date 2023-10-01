import { Level } from "./Level";

type Formatter = (level: Level, message: string, timestamp: Date) => string;

export { Formatter };