export enum LogLevel {
    Debug = 'debug',
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
}

export const LOG_LEVELS: LogLevel[] = [LogLevel.Debug, LogLevel.Info, LogLevel.Warning, LogLevel.Error]

export interface LogDto {
    timestamp: string
    level: LogLevel
    message: string
}

export function createLog(options: {
    timestamp: string
    level: LogLevel
    message: string
}): LogDto {
    return {
        timestamp: options.timestamp,
        level: options.level,
        message: options.message,
    }
}