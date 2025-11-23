import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-12" />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-end justify-around gap-2">
          {[40, 60, 45, 75, 55, 80, 65, 85, 70].map((height, i) => (
            <Skeleton key={i} className="w-full" style={{ height: `${height}%` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
