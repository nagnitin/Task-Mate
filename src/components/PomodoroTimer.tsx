
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  onComplete?: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onComplete }) => {
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            const nextMode = timerMode === 'work' ? 'break' : 'work';
            const nextTime = nextMode === 'work' ? workTime : breakTime;
            
            toast({
              title: nextMode === 'work' ? "Break finished!" : "Work session complete!",
              description: nextMode === 'work' ? "Time to focus again!" : "Time for a short break.",
            });
            
            if (nextMode === 'work' && onComplete) {
              onComplete();
            }
            
            setTimerMode(nextMode);
            setProgress(100);
            return nextTime;
          }
          
          const currentMax = timerMode === 'work' ? workTime : breakTime;
          const newProgress = (prevTime - 1) / currentMax * 100;
          setProgress(newProgress);
          
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timerMode, onComplete]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
    
    if (!isActive) {
      toast({
        title: timerMode === 'work' ? "Focus time started" : "Break time started",
        description: timerMode === 'work' ? "Stay focused for 25 minutes" : "Take a 5 minute break",
      });
    }
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimerMode('work');
    setTimeLeft(workTime);
    setProgress(100);
    
    toast({
      title: "Timer reset",
      description: "Ready to start a new Pomodoro session",
    });
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm dark:glass-card">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {timerMode === 'work' ? 'Focus Time' : 'Break Time'}
          </h3>
          <div className="flex space-x-1">
            <Button 
              variant={timerMode === 'work' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => {
                if (timerMode !== 'work') {
                  setTimerMode('work');
                  setTimeLeft(workTime);
                  setProgress(100);
                  setIsActive(false);
                }
              }}
            >
              Work
            </Button>
            <Button 
              variant={timerMode === 'break' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                if (timerMode !== 'break') {
                  setTimerMode('break');
                  setTimeLeft(breakTime);
                  setProgress(100);
                  setIsActive(false);
                }
              }}
            >
              <Coffee className="h-4 w-4 mr-1" />
              Break
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-6">
          <span className="text-4xl font-bold">
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-center space-x-2 pt-2">
          <Button onClick={toggleTimer} variant="outline" size="icon">
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
