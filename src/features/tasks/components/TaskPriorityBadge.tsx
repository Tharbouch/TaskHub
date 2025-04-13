import { ChevronUp, Minus, ChevronDown } from "lucide-react";
import { Task } from "@/types/task";

type TaskPriorityBadgeProps = {
  priority: Task["priority"];
};

export default function TaskPriorityBadge({
  priority,
}: TaskPriorityBadgeProps) {
  return (
    <div className="flex items-center">
      {priority === "high" && (
        <div className="flex items-center" aria-label="high priority">
          <ChevronUp
            size={20}
            aria-hidden="true"
            style={{ color: "var(--high-priority, #e53935)" }}
          />
          <span className="ml-1 text-sm font-medium">High</span>
        </div>
      )}
      {priority === "medium" && (
        <div className="flex items-center" aria-label="medium priority">
          <Minus
            size={20}
            aria-hidden="true"
            style={{ color: "var(--medium-priority, #fb8c00)" }}
          />
          <span className="ml-1 text-sm font-medium">Medium</span>
        </div>
      )}
      {priority === "low" && (
        <div className="flex items-center" aria-label="low priority">
          <ChevronDown
            size={20}
            aria-hidden="true"
            style={{ color: "var(--low-priority, #43a047)" }}
          />
          <span className="ml-1 text-sm font-medium">Low</span>
        </div>
      )}
    </div>
  );
}
