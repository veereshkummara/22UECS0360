const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'logs.txt');

function loggingMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || '',
      referrer: req.headers['referer'] || req.headers['referrer'] || ''
    };
    const logLine = JSON.stringify(logEntry) + '\\n';
    fs.appendFile(logFilePath, logLine, (err) => {
      if (err) {
        // Fail silently to avoid breaking the app
      }
    });
  });

  next();
}

module.exports = loggingMiddleware;
