import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores/store";
import { Project } from "@/types/project";
import { deleteProject as deleteProjectAction } from "@/stores/slices/projectsSlice";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/StatusBadge";
import { progressVariants, getProgressLevel } from "@/utils/progress";
import { Button } from "@/components/ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import ProjectDialog from "./ProjectDialog";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";

interface ProjectCardProps {
  id: number;
  text: string;
  description: string;
  totalTasks: number;
  completedTasks: number;
  project: Project; // Added full project object
}

export default function ProjectCard({
  id,
  text,
  description,
  totalTasks,
  completedTasks,
  project,
}: ProjectCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Animate the progress after mount
  useState(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(progressPercentage);
    }, 100);
    return () => clearTimeout(timer);
  });

  const handleCardClick = () => {
    navigate(`/projects/${id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProjectAction(id)).unwrap();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-lg p-6 border dark:border-4 border-gray-400 dark:border-gray-700"
      >
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
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex justify-between">
              <span>{`${completedTasks}/${totalTasks} tasks completed`}</span>
              <span className="sr-only">
                {progressPercentage === 100
                  ? "All tasks completed"
                  : `${totalTasks - completedTasks} tasks remaining`}
              </span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={handleEditClick}
              >
                <EditIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 rounded-md"
                onClick={handleDeleteClick}
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Project Dialog */}
      <ProjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        project={project}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${text}"? This action cannot be undone and will delete all tasks associated with this project.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
