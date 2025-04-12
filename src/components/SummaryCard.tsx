import { ChevronUp, ChevronDown, Minus } from "lucide-react";

export default function SummaryCard({
  text,
  numberOfTasks,
  priority,
  ariaLabel,
}: {
  text: string;
  numberOfTasks: number;
  priority: { high: number; low: number; medium: number };
  ariaLabel?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-between gap-2 max-w-[240px] min-h-80 max-h-80 w-full "
      aria-label={ariaLabel || `${text} summary card`}
    >
      <h2 className="text-xl font-bold mb-1 w-full text-start">{text}</h2>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 flex flex-col w-full h-full justify-between border dark:border-4 border-gray-400 dark:border-gray-700 transition-colors">
        <div className="flex-grow flex items-center justify-center py-2">
          <p className="text-center text-black dark:text-white text-2xl font-bold">
            {numberOfTasks}
          </p>
        </div>

        <div className="flex justify-around pt-2">
          <div
            className="text-center"
            aria-label={`${priority.high} high priority tasks`}
          >
            <ChevronUp
              className="mx-auto"
              size={18}
              aria-hidden="true"
              style={{ color: "var(--high-priority, #e53935)" }}
            />
            <p className="text-base font-semibold">{priority.high}</p>
          </div>
          <div
            className="text-center"
            aria-label={`${priority.medium} medium priority tasks`}
          >
            <Minus
              className="mx-auto"
              size={18}
              aria-hidden="true"
              style={{ color: "var(--medium-priority, #fb8c00)" }}
            />
            <p className="text-base font-semibold">{priority.medium}</p>
          </div>
          <div
            className="text-center"
            aria-label={`${priority.low} low priority tasks`}
          >
            <ChevronDown
              className="mx-auto"
              size={18}
              aria-hidden="true"
              style={{ color: "var(--low-priority, #43a047)" }}
            />
            <p className="text-base font-semibold">{priority.low}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
