import { Task } from "@/types/task";
import TaskPriorityBadge from "./TaskPriorityBadge";

type TaskCardProps = {
  task: Task;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, taskId: number) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  formatDate: (date: string) => string;
};

export default function TaskCard({
  task,
  onDragStart,
  onDragEnd,
  formatDate,
}: TaskCardProps) {
  return (
    <div
      key={task.id}
      draggable
      onDragStart={(event) => onDragStart(event, task.id)}
      onDragEnd={onDragEnd}
      className="bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow cursor-move dark:border dark:border-gray-600"
    >
      <h4 className="font-medium dark:text-white">{task.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {task.description}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <TaskPriorityBadge priority={task.priority} />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
}
