const winston = require ("winston");
const fs= require ("fs");
const path= require ("path");
const dotenv= require ("dotenv");

dotenv.config();

const logsDir = process.env.LOGS_DIR || 'logs';

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating logs directory: ${err.message}`);
            process.exit(1);
        }
    });
}

// Function to get log filename with date
const getLogFileName = (logLevel) => {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return path.join(logsDir, `db-${logLevel}-${date}.log`);
};

const transports = [
    new winston.transports.File({
        filename: getLogFileName('info'),
        level: 'info'
    }),
    new winston.transports.File({
        filename: getLogFileName('error'),
        level: 'error'
    })
];

exports.logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`)
    ),
    transports: transports
});

exports.errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`)
    ),
    transports: [
        new winston.transports.File({
            filename: getLogFileName('error'),
            level: 'error'
        })
    ]
});
