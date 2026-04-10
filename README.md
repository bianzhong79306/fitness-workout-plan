# FitPlan Pro 2.0

智能健身知识平台 - 教你怎么练，科学健身

## 产品定位

FitPlan Pro 是一个**健身知识平台**，而非传统的"陪你练"应用。

```
传统健身应用：陪你练 → 点击完成 → 假成就 → 无意义排名
FitPlan Pro：教你练 → 学习知识 → 自己实践 → 记录成长
```

用户来这里**学习**怎么锻炼，然后自己去健身房/家里练。

## 核心功能

- 📚 **动作百科** - 300+ 动作的详细教学（要点、错误、替代）
- 📖 **训练知识库** - 增肌原理、减脂策略、周期化训练等系统知识
- 🤖 **AI 智能生成** - 根据你的条件生成个性化训练计划模板
- ⏱️ **训练计时器** - HIIT、Tabata、倒计时等专业计时
- 🌍 **中英双语** - 完整的国际化支持

## Pro 会员权益

| 功能 | Free | Pro |
|------|------|-----|
| 动作百科 | ✅ 基础内容 | ✅ 全部详细教学 |
| 知识库 | ✅ 基础文章 | ✅ 全部文章 |
| AI生成 | 1次/天 | 无限 |
| AI问答 | ❌ | ✅ 无限 |
| 饮食指南 | ❌ | ✅ |
| 数据导出 | ❌ | ✅ |

价格：$9.99/月 或 $79.99/年（省20%）

## 技术栈

- **框架**: Next.js 15 (App Router)
- **运行时**: Edge Runtime (Cloudflare)
- **数据库**: Cloudflare D1 (SQLite)
- **认证**: NextAuth.js v5 (Google OAuth)
- **国际化**: next-intl
- **UI**: shadcn/ui + Tailwind CSS 4
- **AI**: Wenwen AI (Claude Haiku)
- **支付**: PayPal

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## 环境变量

```env
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_SECRET=your-auth-secret-min-32-chars
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=live
AI_API_KEY=your-wenwen-ai-key
```

## 项目结构

```
src/
├── app/[locale]/         # 国际化路由
│   ├── knowledge/        # 训练知识库
│   ├── exercises/        # 动作百科
│   ├── plans/            # 训练计划模板
│   ├── ai-plan/          # AI生成器
│   └── timers/           # 训练计时器
├── data/
│   ├── exercises.ts      # 300+ 动作数据
│   ├── workout-plans.ts  # 训练计划数据
│   └── knowledge-articles.ts  # 知识文章
└── components/           # UI组件
```

## 开发路线

详见 [REQUIREMENTS.md](./REQUIREMENTS.md)

## License

MIT