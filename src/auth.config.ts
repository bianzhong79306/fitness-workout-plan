import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Cloudflare Pages Edge Runtime cookies 配置
const useSecureCookies = process.env.AUTH_URL?.startsWith("https://") ?? true;

const cookiePrefix = useSecureCookies ? "__Secure-" : "";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  // Cloudflare Pages 需要信任 host
  trustHost: true,
  // 使用 JWT session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Cookies 配置 - Cloudflare Pages Edge Runtime 兼容
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: undefined,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${cookiePrefix}authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}authjs.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 15,
      },
    },
    state: {
      name: `${cookiePrefix}authjs.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 60 * 15,
      },
    },
    nonce: {
      name: `${cookiePrefix}authjs.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // 保护的路由：dashboard、workout、progress
      const isProtectedRoute =
        pathname.includes("/dashboard") ||
        pathname.includes("/workout") ||
        pathname.includes("/progress") ||
        pathname.match(/\/(zh|en)\/(dashboard|workout|progress)/) !== null;

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // 首次登录时，同步用户到数据库
      if (user?.email && account) {
        try {
          const { getRequestContext } = await import('@cloudflare/next-on-pages');
          const { env } = getRequestContext();
          const db = env.DB;

          if (db) {
            // 查找或创建用户
            let dbUser = await db
              .prepare("SELECT id FROM users WHERE email = ?")
              .bind(user.email)
              .first<{ id: string }>();

            if (!dbUser) {
              // 创建新用户
              const newId = crypto.randomUUID();
              await db
                .prepare("INSERT INTO users (id, email, name, created_at, last_login) VALUES (?, ?, ?, datetime('now'), datetime('now'))")
                .bind(newId, user.email, user.name || null)
                .run();
              dbUser = { id: newId };
            } else {
              // 更新最后登录时间
              await db
                .prepare("UPDATE users SET last_login = datetime('now') WHERE email = ?")
                .bind(user.email)
                .run();
            }

            // 使用数据库中的用户 ID
            token.id = dbUser.id;
          }
        } catch (e) {
          // 如果获取不到 D1，使用原始 ID
          if (user.id) token.id = user.id;
        }
      } else if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};