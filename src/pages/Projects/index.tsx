import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import ProjectCard from "@/features/projects/components/ProjectCard";
import ViewSwitch from "@/components/common/ViewSwitch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProjectProgress from "@/features/projects/components/ProjectProgress";
import { StatusBadge } from "@/components/common/StatusBadge";
import { fetchProjects, deleteProject } from "@/stores/slices/projectsSlice";
import { fetchTasks } from "@/stores/slices/tasksSlice";
import { RootState, AppDispatch } from "@/stores/store";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import ProjectDialog from "@/features/projects/components/ProjectDialog";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { useNavigate } from "react-router";

interface ProjectsPageProps {
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => void;
  fetchTasks: () => void;
}
const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  tasks,
  loading,
  error,
  fetchProjects,
  fetchTasks,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleRowClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setProjectToDelete({ id: project.id, name: project.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      try {
        await dispatch(deleteProject(projectToDelete.id)).unwrap();
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-4xl font-bold">Projects</h2>
      <div className="flex justify-between items-center my-4 p-2">
        <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />

        <Button
          onClick={() => setNewProjectDialogOpen(true)}
          className="flex items-center gap-2 rounded-md"
        >
          <PlusIcon size={18} /> New Project
        </Button>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* New Project Dialog */}
      <ProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        mode="create"
      />

      {/* Edit Project Dialog */}
      <ProjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        project={editingProject || undefined}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Project"
        description={
          projectToDelete
            ? `Are you sure you want to delete "${projectToDelete.name}"? This action cannot be undone and will delete all tasks associated with this project.`
            : "Are you sure you want to delete this project?"
        }
        onConfirm={handleDeleteConfirm}
      />

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {projects.map((project) => {
            // Calculate dynamic task counts for each project
            const projectTasks = tasks.filter(
              (task) => task.projectId === project.id
            );
            const totalTasks = projectTasks.length;
            const completedTasks = projectTasks.filter(
              (task) => task.status === "completed"
            ).length;

            return (
              <ProjectCard
                key={project.id}
                id={project.id}
                text={project.name}
                description={project.description}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                project={project}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border bg-white dark:bg-gray-800 shadow-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Project</TableHead>
                <TableHead className="text-center">Description</TableHead>
                <TableHead className="text-center">Progress</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Tasks</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                // Calculate task counts dynamically for each project
                const projectTasks = tasks.filter(
                  (task) => task.projectId === project.id
                );
                const totalTasks = projectTasks.length;
                const completedTasks = projectTasks.filter(
                  (task) => task.status === "completed"
                ).length;

                return (
                  <TableRow
                    key={project.id}
                    onClick={() => handleRowClick(project.id)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>
                      {project.description.length > 100
                        ? `${project.description.substring(0, 100)}...`
                        : project.description}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="max-w-xs">
                        <ProjectProgress
                          completedTasks={completedTasks}
                          totalTasks={totalTasks}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        isComplete={
                          completedTasks === totalTasks && totalTasks > 0
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {completedTasks}/{totalTasks}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-md"
                          onClick={(e) => handleEditClick(e, project)}
                        >
                          <EditIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 rounded-md"
                          onClick={(e) => handleDeleteClick(e, project)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No projects found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  projects: state.projects.items,
  tasks: state.tasks.items,
  // Here loading and error take a combined status from both slices.
  loading: state.projects.loading || state.tasks.loading,
  error: state.projects.error || state.tasks.error,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  fetchProjects: () => dispatch(fetchProjects()),
  fetchTasks: () => dispatch(fetchTasks()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsPage);
