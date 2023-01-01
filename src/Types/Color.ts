// declare type Color = "RED" | "PURPLE" | "YELLOW" | "GREEN" | "BLUE" | "WHITE" | "CYAN";

enum Colors {
    reset = "\u001b[0m",
    black = "\u001b[30m",
    brightBlack = "\u001b[30;1m",
    red = "\u001b[31m",
    brightRed = "\u001b[31;1m",
    green = "\u001b[32m",
    brightGreen = "\u001b[32;1m",
    yellow = "\u001b[33m",
    brightYellow = "\u001b[33;1m",
    blue = "\u001b[34m",
    brightBlue = "\u001b[34;1m",
    magenta = "\u001b[35m",
    brightMagenta = "\u001b[35;1m",
    cyan = "\u001b[36m",
    brightCyan = "\u001b[36;1m",
    white = "\u001b[37m",
    brightWhite = "\u001b[37;1m",
}

export default Colors;