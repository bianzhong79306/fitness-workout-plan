// Exercises Loading Component

import { Dumbbell } from 'lucide-react';

export default function ExercisesLoading() {
  return (
    <div className="container py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>

      {/* Search Skeleton */}
      <div className="mb-6">
        <div className="h-10 w-full max-w-md bg-muted rounded animate-pulse" />
      </div>

      {/* Exercise Cards Skeleton */}
      {[1, 2, 3, 4].map((section) => (
        <div key={section} className="mb-8">
          <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div key={card} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-muted rounded animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-3 w-full bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}