import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

type TaskColumnProps = {
  title: string;
  status: Task["status"];
  tasks: Task[];
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (
    event: React.DragEvent<HTMLDivElement>,
    status: Task["status"]
  ) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, taskId: number) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  formatDate: (date: string) => string;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
};

export default function TaskColumn({
  title,
  status,
  tasks,
  onDragOver,
  onDrop,
  onDragLeave,
  onDragStart,
  onDragEnd,
  formatDate,
}: TaskColumnProps) {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div
      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-black dark:border-gray-600"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(event) => onDrop(event, status)}
    >
      <h3 className="text-lg font-semibold mb-3 dark:text-white">{title}</h3>
      <div className="min-h-[200px]">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
}
