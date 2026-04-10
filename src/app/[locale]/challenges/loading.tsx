// Challenges Loading Component

import { Target } from 'lucide-react';

export default function ChallengesLoading() {
  return (
    <div className="container py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((stat) => (
          <div key={stat} className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded animate-pulse" />
              <div>
                <div className="h-3 w-16 bg-muted rounded animate-pulse mb-2" />
                <div className="h-5 w-8 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="mb-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((tab) => (
            <div key={tab} className="h-8 w-20 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Challenge Cards Skeleton */}
      {[1, 2].map((section) => (
        <div key={section} className="mb-8">
          <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((card) => (
              <div key={card} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-3 w-full bg-muted rounded animate-pulse mb-3" />
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}