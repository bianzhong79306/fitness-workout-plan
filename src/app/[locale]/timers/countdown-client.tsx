"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";

export function CountdownClient({ isZh }: { isZh: boolean }) {
  const [inputMinutes, setInputMinutes] = useState(1);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const start = () => {
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(inputMinutes * 60 + inputSeconds);
    }
    setIsRunning(true);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(inputMinutes * 60 + inputSeconds);
  };

  const handleInputChange = () => {
    if (!isRunning) {
      setTimeLeft(inputMinutes * 60 + inputSeconds);
    }
  };

  useEffect(() => {
    handleInputChange();
  }, [inputMinutes, inputSeconds]);

  return (
    <div className="text-center">
      <div className="text-6xl font-mono font-bold mb-8">{formatTime(timeLeft)}</div>

      {!isRunning && timeLeft === inputMinutes * 60 + inputSeconds && (
        <div className="flex items-center justify-center gap-4 mb-6">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              {isZh ? "分钟" : "Minutes"}
            </label>
            <Input
              type="number"
              min={0}
              max={60}
              value={inputMinutes}
              onChange={(e) => setInputMinutes(parseInt(e.target.value) || 0)}
              className="w-20 text-center"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              {isZh ? "秒" : "Seconds"}
            </label>
            <Input
              type="number"
              min={0}
              max={59}
              value={inputSeconds}
              onChange={(e) => setInputSeconds(parseInt(e.target.value) || 0)}
              className="w-20 text-center"
            />
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Button size="lg" onClick={start} disabled={isRunning} className="w-32">
          <Play className="mr-2 h-4 w-4" />
          {isZh ? "开始" : "Start"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
          className="w-32"
        >
          <Pause className="mr-2 h-4 w-4" />
          {isZh ? "暂停" : "Pause"}
        </Button>
        <Button size="lg" variant="secondary" onClick={reset} className="w-32">
          <RotateCcw className="mr-2 h-4 w-4" />
          {isZh ? "重置" : "Reset"}
        </Button>
      </div>
    </div>
  );
}