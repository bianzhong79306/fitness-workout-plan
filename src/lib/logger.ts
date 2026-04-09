// 简单的日志工具

type LogLevel = "info" | "warn" | "error" | "debug";

const isDevelopment = process.env.NODE_ENV !== "production";

function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

export const logger = {
  info: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(formatMessage("info", message), data ?? "");
    }
  },

  warn: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.warn(formatMessage("warn", message), data ?? "");
    }
  },

  error: (message: string, error?: unknown) => {
    console.error(formatMessage("error", message), error ?? "");
    // 在生产环境可以发送到日志服务
  },

  debug: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.debug(formatMessage("debug", message), data ?? "");
    }
  },
};