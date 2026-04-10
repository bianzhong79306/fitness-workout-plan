// Challenge types

export interface Challenge {
  id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  icon: string;
  challenge_type: 'daily' | 'weekly' | 'monthly' | 'community';
  goal_type: 'workouts' | 'duration' | 'sets' | 'streak_days' | 'community_total';
  goal_value: number;
  reward_points: number;
  reward_achievement_id: string | null;
  start_at: string;
  end_at: string;
  is_active: boolean;
  is_system: boolean;
  participants_count: number;
  completions_count: number;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'active' | 'completed' | 'expired';
  current_progress: number;
  target_progress: number;
  joined_at: string;
  completed_at: string | null;
  last_progress_at: string | null;
  reward_claimed: boolean;
  reward_claimed_at: string | null;
}

export interface ChallengeWithProgress extends Challenge {
  userChallenge?: UserChallenge;
  is_joined?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  challenge_id: string;
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  contribution: number;
  rank: number;
  updated_at: string;
}

export type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'community';
export type GoalType = 'workouts' | 'duration' | 'sets' | 'streak_days' | 'community_total';
export type ChallengeStatus = 'active' | 'completed' | 'expired';