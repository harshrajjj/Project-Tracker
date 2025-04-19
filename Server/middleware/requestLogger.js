import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create request log file
const requestLogFile = path.join(logsDir, 'requests.log');

// Request logger middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request details
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection?.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    userId: (req.user && req.user.id) ? req.user.id : 'unauthenticated'
  };

  // Log response when it's sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    logEntry.statusCode = res.statusCode;
    logEntry.duration = `${duration}ms`;

    // Append to log file
    fs.appendFile(
      requestLogFile,
      JSON.stringify(logEntry) + '\n',
      (err) => {
        if (err) {
          console.error('Error writing to request log:', err);
        }
      }
    );
  });

  next();
};
