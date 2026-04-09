// Cloudflare D1 数据库类型定义

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  error?: string;
  meta?: {
    changes: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
  };
}

// 扩展全局类型以支持 Cloudflare 环境
declare global {
  interface CloudflareEnv {
    DB: D1Database;
    WENWEN_AI_API_KEY?: string;
  }

  // 扩展 ProcessEnv 以包含 Cloudflare 环境变量
  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv {
      AUTH_GOOGLE_ID?: string;
      AUTH_GOOGLE_SECRET?: string;
      AUTH_URL?: string;
      AUTH_SECRET?: string;
    }
  }
}

// 类型守卫
export function isD1Database(env: unknown): env is D1Database {
  return (
    typeof env === 'object' &&
    env !== null &&
    'prepare' in env &&
    typeof (env as D1Database).prepare === 'function'
  );
}