import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Calendar } from "@/components/ui/calendar";
import SummaryCard from "@/pages/Dashboard/components/SummaryCard";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { fetchProjects } from "@/stores/slices/projectsSlice";
import { fetchTasks } from "@/stores/slices/tasksSlice";
import { RootState, AppDispatch } from "@/stores/store";
import { Project } from "@/types/project";
import { Task } from "@/types/task";

// Compute summary information from the tasks list.
// When a status is provided, only tasks with that status are used.
const computeSummary = (tasks: Task[], status?: string) => {
  const filteredTasks = status
    ? tasks.filter((task) => task.status === status)
    : tasks;
  const count = filteredTasks.length;
  const priority = { high: 0, medium: 0, low: 0 };

  filteredTasks.forEach((task) => {
    if (priority[task.priority] !== undefined) {
      priority[task.priority]++;
    }
  });

  return { count, priority };
};

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
  projectsLoading: boolean;
  projectsError: string | null;
  tasksLoading?: boolean; // Make optional
  tasksError?: string | null; // Make optional
  fetchProjects: () => void;
  fetchTasks: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  projects = [], // Provide defaults
  tasks = [],
  projectsLoading = false,
  projectsError = null,
  fetchProjects = () => {}, // Default no-op function
  fetchTasks = () => {},
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  // Overall tasks summaries
  const totalSummary = computeSummary(tasks);
  const inProgressSummary = computeSummary(tasks, "in_progress");
  const completedSummary = computeSummary(tasks, "completed");

  return (
    <section className="container mx-auto px-4">
      {/* Summary Cards and Calendar */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        <SummaryCard
          text="Total Tasks"
          numberOfTasks={totalSummary.count}
          priority={totalSummary.priority}
          ariaLabel="Summary of all tasks"
        />
        <SummaryCard
          text="In Progress"
          numberOfTasks={inProgressSummary.count}
          priority={inProgressSummary.priority}
          ariaLabel="Summary of tasks in progress"
        />
        <SummaryCard
          text="Completed"
          numberOfTasks={completedSummary.count}
          priority={completedSummary.priority}
          ariaLabel="Summary of completed tasks"
        />
        <div className="flex flex-col gap-4 max-w-xs mx-auto sm:mx-0">
          <h2 className="text-xl font-semibold">Calendar</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md shadow-xl bg-white dark:bg-gray-800 w-full max-w-[240px] lg:max-w-[280px] border dark:border-4 border-gray-400 dark:border-gray-700"
            classNames={{
              months: "text-sm",
              day: "h-7 w-7 p-0 text-xs",
            }}
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Projects List</h2>
        {projectsLoading && <p>Loading projects...</p>}
        {projectsError && <p className="text-red-500">{projectsError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {projects.map((project) => {
            // Dynamically calculate total and completed tasks for each project.
            const projectTasks = tasks.filter(
              (task) => task.projectId === project.id
            );
            const totalTasks = projectTasks.length;
            const completedTasks = projectTasks.filter(
              (task) => task.status === "completed"
            ).length;

            return (
              <ProjectCard
                project={project}
                key={project.id}
                id={project.id}
                text={project.name}
                description={project.description}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  projects: state.projects.items,
  tasks: state.tasks.items,
  projectsLoading: state.projects.loading,
  projectsError: state.projects.error,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  fetchProjects: () => dispatch(fetchProjects()),
  fetchTasks: () => dispatch(fetchTasks()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
