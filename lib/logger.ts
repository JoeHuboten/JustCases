/**
 * Structured logging utility for Just Cases
 * Replaces console.log statements with proper log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  requestId?: string;
}

interface ErrorWithCode {
  code?: string | number;
  name?: string;
  message?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Get minimum log level from environment (default: info in prod, debug in dev)
const getMinLogLevel = (): LogLevel => {
  const envLevel = process.env.LOG_LEVEL as LogLevel | undefined;
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return envLevel;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

const MIN_LOG_LEVEL = getMinLogLevel();

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
};

const formatLog = (entry: LogEntry): string => {
  const { timestamp, level, message, context, data, requestId } = entry;
  
  // In production, output JSON for log aggregation
  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify({
      timestamp,
      level,
      message,
      context,
      requestId,
      ...(data && typeof data === 'object' ? { data } : {}),
    });
  }
  
  // In development, output human-readable format
  const levelColors: Record<LogLevel, string> = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[32m',  // green
    warn: '\x1b[33m',  // yellow
    error: '\x1b[31m', // red
  };
  const reset = '\x1b[0m';
  const color = levelColors[level];
  
  let output = `${color}[${level.toUpperCase()}]${reset} ${timestamp}`;
  if (context) output += ` [${context}]`;
  if (requestId) output += ` (${requestId})`;
  output += ` ${message}`;
  if (data) output += `\n${JSON.stringify(data, null, 2)}`;
  
  return output;
};

const createLogEntry = (
  level: LogLevel,
  message: string,
  context?: string,
  data?: unknown,
  requestId?: string
): LogEntry => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  context,
  data,
  requestId,
});

class Logger {
  private context?: string;
  private requestId?: string;

  constructor(context?: string, requestId?: string) {
    this.context = context;
    this.requestId = requestId;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!shouldLog(level)) return;
    
    const entry = createLogEntry(level, message, this.context, data, this.requestId);
    const formatted = formatLog(entry);
    
    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  // Create a child logger with additional context
  child(context: string): Logger {
    return new Logger(
      this.context ? `${this.context}:${context}` : context,
      this.requestId
    );
  }

  // Create a logger with request ID for tracing
  withRequestId(requestId: string): Logger {
    return new Logger(this.context, requestId);
  }
}

// Default logger instance
export const logger = new Logger();

// Create context-specific loggers
export const createLogger = (context: string): Logger => new Logger(context);

// Utility for API routes to extract/generate request ID
export const getRequestId = (headers: Headers): string => {
  return headers.get('x-request-id') || crypto.randomUUID();
};

export function getSafeErrorDetails(error: unknown): { name: string; code?: string | number; message?: string } {
  if (error instanceof Error) {
    const details: { name: string; code?: string | number; message?: string } = {
      name: error.name || 'Error',
    };

    const maybeCode = (error as ErrorWithCode).code;
    if (typeof maybeCode === 'string' || typeof maybeCode === 'number') {
      details.code = maybeCode;
    }

    if (process.env.NODE_ENV !== 'production') {
      details.message = error.message;
    }

    return details;
  }

  if (error && typeof error === 'object') {
    const maybeCode = (error as ErrorWithCode).code;
    const maybeName = (error as ErrorWithCode).name;
    const maybeMessage = (error as ErrorWithCode).message;

    const details: { name: string; code?: string | number; message?: string } = {
      name: typeof maybeName === 'string' && maybeName ? maybeName : 'UnknownError',
    };

    if (typeof maybeCode === 'string' || typeof maybeCode === 'number') {
      details.code = maybeCode;
    }

    if (process.env.NODE_ENV !== 'production' && typeof maybeMessage === 'string' && maybeMessage) {
      details.message = maybeMessage;
    }

    return details;
  }

  return { name: 'UnknownError' };
}

export default Logger;
