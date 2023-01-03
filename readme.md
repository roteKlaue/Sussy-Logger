<h1 align="center"> Sussy Logger </h1>

<p align="center"> Sussy Logger is a fully customizable logger.<br> If given a file path it will write into said file and create it if it doesn't exists.<br> </p>

### Setup:
```js
const { Logger, Levels, FileHandler } = require("sussy-logger");
const logger = new Logger({ 
    closeOnExit: true/false/undefined, // default: true
    hideConsole: true/false/undefined // default: false
});

logger.log(/* level */, /* data */);

logger.formatFile((level, message, timestamp) => {
    /* format hier for file return formatted string */
});

logger.formatConsole((level, message, timestamp) => {
    /* format hier for file return formatted string */
});

logger.format((level, message, timestamp) => {
    /* format hier for both return formatted string */
});

logger.attachFileHandler(new FileHandler("path/to/file", {
    level: 1-5,
    only: true/false/undefined // default: false
}));
```

## Example:

### Code:
```js
const { Logger, Levels } = require("sussy-logger");
const logger = new Logger({ 
    closeOnExit: true,
    hideConsole: false,
});

logger.log(Levels.info, "This is a very simple example.");
```

### Output:

Console:

```
[INFO] This is a very simple example.
```