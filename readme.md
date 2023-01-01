<h1 align="center"> Sussy Logger </h1>

<p align="center"> Sussy Logger is a fully customizable logger.<br> If given a file path it will write into said file and create it if it doesn't exists.<br> </p>

### Setup:
```js
const { Logger, Levels } = require("sussy-logger");
const logger = new Logger({ 
    closeOnExit: true/false/undefined, // standard = true
    hideConsole: true/false/undefined // standard = false
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