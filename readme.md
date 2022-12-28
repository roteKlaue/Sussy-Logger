<h1 align="center"> Sussy Logger </h1>

<p align="center"> Sussy Logger is a fully customizable logger.<br> If given a file path it will write into said file and create it if it doesn't exists.<br> </p>

### Setup:
```js
const { Logger } = require("sussy-logger");
const logger = new Logger({ 
    closeOnExit: true/false/undefined, // standard = true
    path: /* path */,
    append: true/false/undefined, // standard = true
    hideConsole: true/false/undefined // standard = true
});

logger.log(/* level */, /* data */);
logger.format((level, message, timestamp) => {
    /* format hier and return formatted string */
});
```

## Example:

### Code:
```js
const { Logger } = require("sussy-logger");
const logger = new Logger({ 
    closeOnExit: true,
    path: `${__dirname}/example.log`,
    append: false,
    hideConsole: false,
});

logger.log("info", "This is a very simple example.");
```

### Output:

Console:

```
[INFO] This is a very simple example.
```

File:

```
[INFO] This is a very simple example.
```