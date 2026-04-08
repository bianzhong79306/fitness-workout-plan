"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";

export function HIITTimerClient({ isZh }: { isZh: boolean }) {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);
  const [rounds, setRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            if (isWorking) {
              // Switch to rest
              setIsWorking(false);
              return restTime;
            } else {
              // Rest done, next round or finish
              if (currentRound >= rounds) {
                setIsRunning(false);
                return 0;
              }
              setCurrentRound((r) => r + 1);
              setIsWorking(true);
              return workTime;
            }
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isWorking, currentRound, rounds, workTime, restTime]);

  const start = () => {
    if (!isRunning) {
      setTimeLeft(workTime);
      setCurrentRound(1);
      setIsWorking(true);
      setIsRunning(true);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(workTime);
    setCurrentRound(1);
    setIsWorking(true);
  };

  return (
    <div className="text-center">
      {/* Status */}
      <div
        className={`text-2xl font-bold mb-4 ${
          isWorking ? "text-green-500" : "text-blue-500"
        }`}
      >
        {isWorking
          ? isZh
            ? "训练中"
            : "WORK"
          : isZh
          ? "休息"
          : "REST"}
      </div>

      {/* Timer */}
      <div
        className={`text-7xl font-mono font-bold mb-4 ${
          isWorking ? "text-green-500" : "text-blue-500"
        }`}
      >
        {timeLeft}
      </div>

      {/* Round Counter */}
      <div className="text-xl mb-6">
        {isZh ? "第" : "Round"} {currentRound} / {rounds}
      </div>

      {/* Settings */}
      {!isRunning && (
        <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              {isZh ? "训练(秒)" : "Work (s)"}
            </label>
            <Input
              type="number"
              min={5}
              max={300}
              value={workTime}
              onChange={(e) => setWorkTime(parseInt(e.target.value) || 30)}
              className="text-center"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              {isZh ? "休息(秒)" : "Rest (s)"}
            </label>
            <Input
              type="number"
              min={5}
              max={300}
              value={restTime}
              onChange={(e) => setRestTime(parseInt(e.target.value) || 10)}
              className="text-center"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              {isZh ? "轮数" : "Rounds"}
            </label>
            <Input
              type="number"
              min={1}
              max={30}
              value={rounds}
              onChange={(e) => setRounds(parseInt(e.target.value) || 8)}
              className="text-center"
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          onClick={isRunning ? () => setIsRunning(false) : start}
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