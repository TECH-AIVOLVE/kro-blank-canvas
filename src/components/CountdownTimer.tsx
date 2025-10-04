import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime: string;
  onComplete?: () => void;
  className?: string;
}

export const CountdownTimer = ({ endTime, onComplete, className = '' }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        if (onComplete) {
          onComplete();
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  if (timeLeft.isExpired) {
    return (
      <div className={`flex items-center space-x-2 text-muted-foreground ${className}`}>
        <Clock className="w-4 h-4" />
        <span className="text-sm">Voting ended</span>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Clock className="w-4 h-4 text-primary" />
      <div className="flex items-center space-x-2">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-primary">{formatNumber(timeLeft.days)}</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <span className="text-primary">:</span>
          </>
        )}
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-primary">{formatNumber(timeLeft.hours)}</span>
          <span className="text-xs text-muted-foreground">hrs</span>
        </div>
        <span className="text-primary">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-primary">{formatNumber(timeLeft.minutes)}</span>
          <span className="text-xs text-muted-foreground">min</span>
        </div>
        <span className="text-primary">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-primary">{formatNumber(timeLeft.seconds)}</span>
          <span className="text-xs text-muted-foreground">sec</span>
        </div>
      </div>
    </div>
  );
};
