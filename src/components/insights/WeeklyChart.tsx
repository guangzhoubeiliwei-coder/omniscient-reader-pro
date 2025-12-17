import { cn } from '@/lib/utils';

interface DayData {
  day: string;
  chapters: number;
}

interface WeeklyChartProps {
  data: DayData[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxChapters = Math.max(...data.map((d) => d.chapters), 1);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-medium text-foreground mb-4">This Week</h3>
      <div className="flex items-end justify-between gap-2 h-24">
        {data.map((day, index) => {
          const height = (day.chapters / maxChapters) * 100;
          const isToday = index === data.length - 1;

          return (
            <div key={day.day} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] text-muted-foreground">{day.chapters}</span>
              <div className="w-full flex justify-center">
                <div
                  className={cn(
                    'w-6 rounded-t-sm transition-all duration-500',
                    isToday ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
              </div>
              <span
                className={cn(
                  'text-[10px]',
                  isToday ? 'text-primary font-medium' : 'text-muted-foreground'
                )}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
