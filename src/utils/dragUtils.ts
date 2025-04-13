import { Task } from "@/types/task";
import { AppDispatch } from "@/stores/store";
import { updateTaskStatus } from "@/stores/slices/tasksSlice";

// Event handlers for draggable items (cards)
export function onDragStart(
  event: React.DragEvent<HTMLDivElement>,
  taskId: number
) {
  event.dataTransfer.setData("text/plain", taskId.toString());
  // Add a visual effect for dragging
  if (event.currentTarget.classList) {
    event.currentTarget.classList.add("opacity-50");
  }
}

export function onDragEnd(event: React.DragEvent<HTMLDivElement>) {
  // Remove visual effects after drag ends
  if (event.currentTarget.classList) {
    event.currentTarget.classList.remove("opacity-50");
  }
}

// Event handlers for drop targets (columns)
export function onDragOver(event: React.DragEvent<HTMLDivElement>) {
  event.preventDefault();
  // Add a visual effect for drop target
  if (event.currentTarget.classList) {
    event.currentTarget.classList.add("bg-gray-100", "dark:bg-gray-700");
  }
}

export function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
  // Remove visual effect when drag leaves
  if (event.currentTarget.classList) {
    event.currentTarget.classList.remove("bg-gray-100", "dark:bg-gray-700");
  }
}

export function createOnDropHandler(dispatch: AppDispatch) {
  return async (
    event: React.DragEvent<HTMLDivElement>,
    newStatus: Task["status"]
  ) => {
    event.preventDefault();

    // Remove visual effect when drop occurs
    if (event.currentTarget.classList) {
      event.currentTarget.classList.remove("bg-gray-100", "dark:bg-gray-700");
    }

    const taskId = parseInt(event.dataTransfer.getData("text/plain"), 10);

    if (!isNaN(taskId)) {
      try {
        await dispatch(
          updateTaskStatus({ id: taskId, status: newStatus })
        ).unwrap();
        console.log(
          `Task ${taskId} status updated to ${newStatus} successfully`
        );
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    } else {
      console.error("Invalid task ID in drop event");
    }
  };
}
