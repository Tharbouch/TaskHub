import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskPriorityBadge from "../../../features/tasks/components/TaskPriorityBadge";

type CollapsibleTaskSectionProps = {
  title: string;
  status: Task["status"];
  tasks: Task[];
  isExpanded: boolean;
  onToggle: () => void;
  formatDate: (date: string) => string;
};

export default function CollapsibleTaskSection({
  title,
  status,
  tasks,
  isExpanded,
  onToggle,
  formatDate,
}: CollapsibleTaskSectionProps) {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="mb-4">
      <div
        className={`bg-white dark:bg-gray-700 ${
          isExpanded ? "rounded-t-md" : "rounded-md"
        }  border`}
      >
        <Button
          variant="ghost"
          className={`flex items-center ${
            isExpanded ? "rounded-t-md" : "rounded-md"
          } w-full justify-between p-2 hover:bg-gray-200 dark:hover:bg-gray-700`}
          onClick={onToggle}
        >
          <span className="font-semibold dark:text-white">{title}</span>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

      {isExpanded && (
        <Table className="bg-white dark:bg-gray-700 rounded-b-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Title</TableHead>
              <TableHead className="w-2/5">Description</TableHead>
              <TableHead className="w-1/6">Priority</TableHead>
              <TableHead className="w-1/6">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium truncate w-[300px]">
                  {task.title}
                </TableCell>
                <TableCell className="truncate w-[300px]">
                  {task.description}
                </TableCell>
                <TableCell className="w-[100px]">
                  <TaskPriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell className="w-[120px]">
                  {formatDate(task.createdAt)}
                </TableCell>
              </TableRow>
            ))}
            {filteredTasks.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 text-gray-500"
                >
                  No tasks in this section
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
