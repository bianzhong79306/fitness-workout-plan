import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 用户同步到D1数据库
export async function syncUserToD1(
  db: D1Database,
  user: { id: string; email?: string | null; name?: string | null; image?: string | null }
) {
  if (!user.email) return null;

  // 检查用户是否存在
  const existing = await db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(user.email)
    .first();

  if (existing) {
    // 更新最后登录时间
    await db
      .prepare("UPDATE users SET last_login = ? WHERE email = ?")
      .bind(new Date().toISOString(), user.email)
      .run();
    return existing;
  }

  // 创建新用户
  const id = crypto.randomUUID();
  await db
    .prepare(
      "INSERT INTO users (id, email, name, avatar_url, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(
      id,
      user.email,
      user.name,
      user.image,
      new Date().toISOString(),
      new Date().toISOString()
    )
    .run();

  return { id, email: user.email, name: user.name, avatar_url: user.image };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
});