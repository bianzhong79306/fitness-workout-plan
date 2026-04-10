// Dashboard Loading Component

import { BarChart3, CalendarDays, Trophy, Target } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="container py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((stat) => (
          <div key={stat} className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
              <div>
                <div className="h-3 w-20 bg-muted rounded animate-pulse mb-2" />
                <div className="h-5 w-8 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Goal Card */}
        <div className="border rounded-lg p-4">
          <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="h-3 w-48 bg-muted rounded animate-pulse mx-auto" />
        </div>

        {/* Calendar Card */}
        <div className="border rounded-lg p-4">
          <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-8 w-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Achievements Card */}
        <div className="border rounded-lg p-4">
          <div className="h-5 w-24 bg-muted rounded animate-pulse mb-4" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((badge) => (
              <div key={badge} className="w-12 h-12 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Body Metrics Card */}
        <div className="border rounded-lg p-4">
          <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="h-32 w-full bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}