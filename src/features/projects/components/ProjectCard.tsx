import { Progress } from "../../../components/ui/progress";
import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { progressVariants, getProgressLevel } from "@/utils/progress";

export default function ProjectCard({
  text,
  description,
  totalTasks,
  completedTasks,
}: {
  text: string;
  description: string;
  totalTasks: number;
  completedTasks: number;
}) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Animate the progress after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg p-6 border dark:border-4 border-gray-400 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{text}</h3>
        <StatusBadge isComplete={progressPercentage === 100} />
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {description}
      </p>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {progressPercentage}%
          </span>
        </div>

        <Progress
          value={animatedPercentage}
          indecatorClassName={progressVariants({
            progress: getProgressLevel(progressPercentage),
          })}
          className="h-2.5 bg-gray-200 dark:bg-gray-700"
          aria-label={`Project progress: ${progressPercentage}% complete`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
        />

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex justify-between">
          <span>{`${completedTasks}/${totalTasks} tasks completed`}</span>
          <span className="sr-only">
            {progressPercentage === 100
              ? "All tasks completed"
              : `${totalTasks - completedTasks} tasks remaining`}
          </span>
        </p>
      </div>
    </div>
  );
}
