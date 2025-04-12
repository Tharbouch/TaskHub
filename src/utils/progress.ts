import { cva } from "class-variance-authority";

export const progressVariants = cva(
  "h-full w-full flex-1 transition-all duration-700 bg-gradient-to-r",
  {
    variants: {
      progress: {
        low: "from-red-800 to-red-400",
        medium: "from-amber-600 to-amber-400",
        high: "from-emerald-600 to-emerald-400",
        complete: "from-green-500 to-green-500",
      },
    },
    defaultVariants: {
      progress: "low",
    },
  }
);

export function getProgressLevel(percent: number) {
  if (percent === 100) return "complete";
  if (percent >= 70) return "high";
  if (percent >= 50) return "medium";
  return "low";
}

export function calculateProgressPercentage(
  completed: number,
  total: number
): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}
