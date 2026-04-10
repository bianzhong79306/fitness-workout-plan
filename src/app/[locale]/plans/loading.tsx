// Plans Loading Component

import { Dumbbell } from 'lucide-react';

export default function PlansLoading() {
  return (
    <div className="container py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>

      {/* Filter Skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((btn) => (
          <div key={btn} className="h-8 w-20 bg-muted rounded animate-pulse" />
        ))}
      </div>

      {/* Plan Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((card) => (
          <div key={card} className="border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="h-6 w-full bg-muted rounded animate-pulse mb-0" />
            <div className="p-4">
              {/* Title */}
              <div className="h-5 w-32 bg-muted rounded animate-pulse mb-3" />
              {/* Description */}
              <div className="h-3 w-full bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-3/4 bg-muted rounded animate-pulse mb-4" />
              {/* Stats */}
              <div className="flex gap-4 mb-4">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </div>
              {/* Button */}
              <div className="h-9 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}