import winston from "winston";

const logger = winston.createLogger({
    transports: [
        // TODO: logging to console should probably be disabled in production builds.
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({
            filename: "launcher.log",
            format: winston.format.simple(),
            // Override the default options that append to log file - we want
            // to recreate the file on every launch.
            options: {}
        })
    ]
})

export default logger;