import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  isComplete: boolean;
  className?: string;
}

export function StatusBadge({ isComplete, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs text-center font-medium",
        isComplete
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          : "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
        className
      )}
    >
      {isComplete ? "Complete" : "In Progress"}
    </span>
  );
}
