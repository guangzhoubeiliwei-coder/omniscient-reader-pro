import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn('min-h-screen pb-20 px-4 pt-4', className)}>
      <div className="max-w-lg mx-auto">
        {children}
      </div>
    </main>
  );
}
