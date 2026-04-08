// 用户类型定义

import type { FitnessGoal, Difficulty } from './plan';

export type MembershipType = 'free' | 'premium' | 'pro';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  fitnessGoal?: FitnessGoal;
  fitnessLevel?: Difficulty;
  membershipType: MembershipType;
  createdAt: string;
  lastLogin?: string;
}

// 扩展next-auth类型
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}