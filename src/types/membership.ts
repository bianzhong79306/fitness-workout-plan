// 会员系统类型定义

// 会员等级
export type TierId = 'free' | 'pro' | 'premium';

// 会员状态
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';

// 会员等级配置
export interface MembershipTier {
  id: TierId;
  name: string;           // 'Free', 'Pro', 'Premium'
  nameZh: string;         // '免费用户', '专业会员', '高级会员'
  priceMonthly: number;   // 月费价格（美元）
  priceYearly: number;    // 年费价格（美元）
  features: TierFeature[];
  limits: TierLimits;
  isActive: boolean;
}

// 会员功能项
export interface TierFeature {
  key: string;
  name: string;
  nameZh: string;
  included: boolean;
  highlight?: boolean;
}

// 会员限制配置
export interface TierLimits {
  plansPerMonth: number;        // 每月可生成计划数
  aiGenerationsPerDay: number;  // 每日AI生成次数
  customPlans: number;          // 自定义计划数
  progressHistory: number;      // 进度历史保留天数
  bodyMetricsRecords: number;   // 身体数据记录数
  canAccessPremiumPlans: boolean;
  canExportData: boolean;
  canSyncWearable: boolean;
  priority: number;             // 优先级（越高越优先）
}

// 用户订阅
export interface UserSubscription {
  id: string;
  userId: string;
  tierId: TierId;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt?: string;
  cancelledAt?: string;
  createdAt: string;
}

// 会员等级默认配置
export const DEFAULT_TIERS: MembershipTier[] = [
  {
    id: 'free',
    name: 'Free',
    nameZh: '免费用户',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      { key: 'basic_plans', name: 'Basic Plans', nameZh: '基础训练计划', included: true },
      { key: 'basic_timer', name: 'Basic Timer', nameZh: '基础计时器', included: true },
      { key: 'progress_tracking', name: 'Progress Tracking', nameZh: '进度追踪', included: true },
      { key: 'ai_generation', name: 'AI Plan Generation', nameZh: 'AI智能生成', included: false },
      { key: 'premium_plans', name: 'Premium Plans', nameZh: '高级计划', included: false },
      { key: 'data_export', name: 'Data Export', nameZh: '数据导出', included: false },
    ],
    limits: {
      plansPerMonth: 3,
      aiGenerationsPerDay: 1,
      customPlans: 1,
      progressHistory: 30,
      bodyMetricsRecords: 50,
      canAccessPremiumPlans: false,
      canExportData: false,
      canSyncWearable: false,
      priority: 0,
    },
    isActive: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    nameZh: '专业会员',
    priceMonthly: 9.99,
    priceYearly: 79.99,
    features: [
      { key: 'basic_plans', name: 'Basic Plans', nameZh: '基础训练计划', included: true },
      { key: 'basic_timer', name: 'Basic Timer', nameZh: '基础计时器', included: true },
      { key: 'progress_tracking', name: 'Progress Tracking', nameZh: '进度追踪', included: true },
      { key: 'ai_generation', name: 'AI Plan Generation', nameZh: 'AI智能生成', included: true, highlight: true },
      { key: 'premium_plans', name: 'Premium Plans', nameZh: '高级计划', included: true },
      { key: 'data_export', name: 'Data Export', nameZh: '数据导出', included: false },
    ],
    limits: {
      plansPerMonth: 20,
      aiGenerationsPerDay: 10,
      customPlans: 10,
      progressHistory: 365,
      bodyMetricsRecords: 500,
      canAccessPremiumPlans: true,
      canExportData: false,
      canSyncWearable: false,
      priority: 1,
    },
    isActive: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    nameZh: '高级会员',
    priceMonthly: 19.99,
    priceYearly: 159.99,
    features: [
      { key: 'basic_plans', name: 'Basic Plans', nameZh: '基础训练计划', included: true },
      { key: 'basic_timer', name: 'Basic Timer', nameZh: '基础计时器', included: true },
      { key: 'progress_tracking', name: 'Progress Tracking', nameZh: '进度追踪', included: true },
      { key: 'ai_generation', name: 'AI Plan Generation', nameZh: 'AI智能生成（无限）', included: true, highlight: true },
      { key: 'premium_plans', name: 'Premium Plans', nameZh: '高级计划', included: true },
      { key: 'data_export', name: 'Data Export', nameZh: '数据导出', included: true },
    ],
    limits: {
      plansPerMonth: -1, // 无限制
      aiGenerationsPerDay: -1,
      customPlans: -1,
      progressHistory: -1,
      bodyMetricsRecords: -1,
      canAccessPremiumPlans: true,
      canExportData: true,
      canSyncWearable: true,
      priority: 2,
    },
    isActive: true,
  },
];

// 获取会员等级
export function getTierById(id: TierId): MembershipTier | undefined {
  return DEFAULT_TIERS.find(tier => tier.id === id);
}

// 比较会员等级
export function compareTiers(a: TierId, b: TierId): number {
  const tierA = getTierById(a);
  const tierB = getTierById(b);
  return (tierA?.limits.priority ?? 0) - (tierB?.limits.priority ?? 0);
}

// 检查是否可以访问功能
export function canAccessFeature(tierId: TierId, featureKey: string): boolean {
  const tier = getTierById(tierId);
  if (!tier) return false;
  const feature = tier.features.find(f => f.key === featureKey);
  return feature?.included ?? false;
}