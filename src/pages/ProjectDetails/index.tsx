import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { RootState, AppDispatch } from "@/stores/store";
import { fetchProjects } from "@/stores/slices/projectsSlice";
import { fetchTasks } from "@/stores/slices/tasksSlice";
import { Task } from "@/types/task";
import { Project } from "@/types/project";
import ViewSwitch from "@/components/common/ViewSwitch";
import {
  createOnDropHandler,
  onDragOver,
  onDragStart,
  onDragEnd,
  onDragLeave,
} from "@/utils/dragUtils";
import CollapsibleTaskSection from "./components/CollapsibleTaskSection";
import TaskColumn from "@/features/tasks/components/TaskColumn";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewTaskDialog from "@/features/tasks/components/NewTaskForm";

interface ProjectDetailsProps {
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => void;
  fetchTasks: (projectId: number) => void;
  dispatch: AppDispatch;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  projects,
  tasks,
  loading,
  error,
  fetchProjects,
  fetchTasks,
  dispatch,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [expandedSections, setExpandedSections] = useState({
    to_do: true,
    in_progress: true,
    completed: true,
  });
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);

  const toggleSection = (section: "to_do" | "in_progress" | "completed") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const onDrop = createOnDropHandler(dispatch);

  useEffect(() => {
    fetchProjects();
    if (projectId) {
      fetchTasks(Number(projectId));
    }
  }, [fetchProjects, fetchTasks, projectId]);

  const project = projects.find((p) => p.id === Number(projectId));

  if (loading) return <p>Loading project details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <section className="container mx-auto px-4 flex flex-col">
      <h2 className="text-4xl font-bold dark:text-white">Tasks</h2>

      <div className="flex justify-between items-center my-4 p-2">
        <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
        <Button
          onClick={() => setNewTaskDialogOpen(true)}
          className="flex items-center gap-2 rounded-md"
        >
          <PlusIcon />
        </Button>
      </div>

      <NewTaskDialog
        open={newTaskDialogOpen}
        onOpenChange={setNewTaskDialogOpen}
        projectId={Number(projectId)}
      />

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <TaskColumn
            title="To Do"
            status="to_do"
            tasks={tasks}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            formatDate={(date) => new Date(date).toLocaleDateString()}
          />
          <TaskColumn
            title="In Progress"
            status="in_progress"
            tasks={tasks}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            formatDate={(date) => new Date(date).toLocaleDateString()}
          />
          <TaskColumn
            title="Completed"
            status="completed"
            tasks={tasks}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            formatDate={(date) => new Date(date).toLocaleDateString()}
          />
        </div>
      ) : (
        <div className="mt-6">
          <CollapsibleTaskSection
            title="To Do"
            status="to_do"
            tasks={tasks}
            isExpanded={expandedSections.to_do}
            onToggle={() => toggleSection("to_do")}
            formatDate={(date) => new Date(date).toLocaleDateString()}
          />
          <CollapsibleTaskSection
            title="In Progress"
            status="in_progress"
            tasks={tasks}
            isExpanded={expandedSections.in_progress}
            onToggle={() => toggleSection("in_progress")}
            formatDate={(date) => new Date(date).toLocaleDateString()}
          />
          <CollapsibleTaskSection
            title="Completed"
            status="completed"
            tasks={tasks}
            isExpanded={expandedSections.completed}
            onToggle={() => toggleSection("completed")}
            formatDate={(date) => new Date(date).toLocaleDateString()}
          />
        </div>
      )}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  projects: state.projects.items,
  tasks: state.tasks.items,
  loading: state.projects.loading || state.tasks.loading,
  error: state.projects.error || state.tasks.error,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  fetchProjects: () => dispatch(fetchProjects()),
  fetchTasks: (projectId: number) => dispatch(fetchTasks(projectId)),
  dispatch, // Pass dispatch for drag & drop updates
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
