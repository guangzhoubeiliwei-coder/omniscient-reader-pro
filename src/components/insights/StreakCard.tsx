import { Flame } from 'lucide-react';

interface StreakCardProps {
  streak: number;
  bestStreak?: number;
}

export function StreakCard({ streak, bestStreak }: StreakCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Flame className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{streak}</span>
            <span className="text-muted-foreground">day streak</span>
          </div>
          {bestStreak && (
            <p className="text-xs text-muted-foreground">Best: {bestStreak} days</p>
          )}
        </div>
      </div>
    </div>
  );
}
