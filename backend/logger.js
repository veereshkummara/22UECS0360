const fs = require('fs');
const path = require('path');
const axios = require('axios');

const logFilePath = path.join(__dirname, 'logs.txt');
const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

// Reusable Log function to send logs to the Test Server API
async function Log(stack, level, packageName, message) {
  // Validate inputs according to constraints
  const validStacks = ['backend', 'frontend'];
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const validPackagesBackend = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service', 'middleware', 'auth', 'config', 'utils'];
  if (!validStacks.includes(stack)) {
    throw new Error(`Invalid stack value: ${stack}`);
  }
  if (!validLevels.includes(level)) {
    throw new Error(`Invalid level value: ${level}`);
  }
  if (!validPackagesBackend.includes(packageName)) {
    throw new Error(`Invalid package value: ${packageName}`);
  }

  const payload = {
    stack: stack,
    level: level,
    package: packageName,
    message: message
  };

  try {
    await axios.post(LOG_API_URL, payload);
  } catch (error) {
    // Fail silently to avoid breaking the app
  }
}

// Existing logging middleware enhanced to use the Log function
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

    // Call reusable Log function with info level for each request
    Log('backend', 'info', 'middleware', `Request: ${req.method} ${req.originalUrl} Status: ${res.statusCode} Duration: ${duration}ms`);
  });

  next();
}

module.exports = loggingMiddleware;
module.exports.Log = Log;
