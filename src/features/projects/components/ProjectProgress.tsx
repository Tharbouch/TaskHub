import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { progressVariants, getProgressLevel } from "@/utils/progress";

interface ProjectProgressProps {
  completedTasks: number;
  totalTasks: number;
  showPercentage?: boolean;
  className?: string;
}

export default function ProjectProgress({
  completedTasks,
  totalTasks,
  showPercentage = true,
  className,
}: ProjectProgressProps) {
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress
        value={percentage}
        className="h-2"
        indecatorClassName={progressVariants({
          progress: getProgressLevel(percentage),
        })}
      />
      {showPercentage && (
        <span className="text-xs whitespace-nowrap">{percentage}%</span>
      )}
    </div>
  );
}
