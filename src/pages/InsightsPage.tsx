import { PageContainer } from '@/components/layout/PageContainer';
import { StatCard } from '@/components/dashboard/StatCard';
import { StreakCard } from '@/components/insights/StreakCard';
import { WeeklyChart } from '@/components/insights/WeeklyChart';
import { ReadingItem } from '@/types/reading';
import { HistoryEntry } from '@/data/schema/HistoryEntry';
import { TrendingUp, Target, Clock, BookOpen, BarChart3 } from 'lucide-react';
import { calculateWeeklyData } from '@/data/engine/weeklyEngine';
import { calculateStats } from '@/data/engine/statsEngine';

interface InsightsPageProps {
  items: ReadingItem[];
  history: HistoryEntry[];
}

export function InsightsPage({ items, history }: InsightsPageProps) {
  const stats = calculateStats(items, history);
  const weeklyData = calculateWeeklyData(history);
  const hasData = items.length > 0;

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Your reading analytics</p>
      </div>

      {!hasData ? (
        <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
          <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No data yet</h3>
          <p className="text-sm text-muted-foreground">
            Add items to your library to see insights
          </p>
        </div>
      ) : (
        <>
          {/* Streak */}
          <div className="mb-6">
            <StreakCard streak={stats.streak} bestStreak={stats.streak} />
          </div>

          {/* Weekly Chart */}
          <div className="mb-6">
            <WeeklyChart data={weeklyData} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard
              label="Chapters/Day"
              value={stats.avgChaptersPerDay}
              icon={TrendingUp}
              color="primary"
            />
            <StatCard
              label="Completion Rate"
              value={`${stats.completionRate}%`}
              icon={Target}
              color="success"
            />
            <StatCard
              label="This Week"
              value={stats.chaptersThisWeek}
              icon={Clock}
            />
            <StatCard
              label="Favorites"
              value={stats.favorites}
              icon={BookOpen}
              color="warning"
            />
          </div>

          {/* Status Breakdown */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-medium text-foreground mb-4">Status Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Reading', value: stats.reading, color: 'bg-status-reading' },
                { label: 'Completed', value: stats.completed, color: 'bg-status-completed' },
                { label: 'Paused', value: stats.paused, color: 'bg-status-paused' },
                { label: 'Planned', value: stats.planned, color: 'bg-status-planned' },
                { label: 'Dropped', value: stats.dropped, color: 'bg-status-dropped' },
              ].map((item) => {
                const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-xs text-foreground">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}
