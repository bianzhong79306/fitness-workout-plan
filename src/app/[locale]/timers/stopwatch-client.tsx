"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export function StopwatchClient({ isZh }: { isZh: boolean }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((t) => t + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="text-center">
      <div className="text-6xl font-mono font-bold mb-8">{formatTime(time)}</div>
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          onClick={() => setIsRunning(!isRunning)}
          className="w-32"
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              {isZh ? "暂停" : "Pause"}
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {isZh ? "开始" : "Start"}
            </>
          )}
        </Button>
        <Button size="lg" variant="outline" onClick={reset} className="w-32">
          <RotateCcw className="mr-2 h-4 w-4" />
          {isZh ? "重置" : "Reset"}
        </Button>
      </div>
    </div>
  );
}