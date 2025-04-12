import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import SummaryCard from "@/pages/Dashboard/components/SummaryCard";
import ProjectCard from "@/features/projects/components/ProjectCard";

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const taskSummary = {
    total: {
      count: 24,
      priority: { high: 8, medium: 12, low: 4 },
    },
    inProgress: {
      count: 10,
      priority: { high: 5, medium: 4, low: 1 },
    },
    completed: {
      count: 14,
      priority: { high: 3, medium: 8, low: 3 },
    },
  };

  const projects = [
    {
      id: 1,
      text: "Website Redesign",
      description: "Updating the company website with new brand guidelines",
      totalTasks: 12,
      completedTasks: 8,
    },
    {
      id: 2,
      text: "Mobile App Development",
      description: "Creating a new customer-facing mobile application",
      totalTasks: 20,
      completedTasks: 5,
    },
    {
      id: 3,
      text: "Q2 Marketing Campaign",
      description: "Planning and executing the Q2 marketing initiatives",
      totalTasks: 15,
      completedTasks: 15,
    },
    {
      id: 4,
      text: "Database Migration",
      description: "Moving data to the new cloud infrastructure",
      totalTasks: 8,
      completedTasks: 2,
    },
  ];

  return (
    <section className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        <SummaryCard
          text="Total Tasks"
          numberOfTasks={taskSummary.total.count}
          priority={taskSummary.total.priority}
          ariaLabel="Summary of all tasks"
        />

        <SummaryCard
          text="In Progress"
          numberOfTasks={taskSummary.inProgress.count}
          priority={taskSummary.inProgress.priority}
          ariaLabel="Summary of tasks in progress"
        />

        <SummaryCard
          text="Completed"
          numberOfTasks={taskSummary.completed.count}
          priority={taskSummary.completed.priority}
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
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Projects List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              text={project.text}
              description={project.description}
              totalTasks={project.totalTasks}
              completedTasks={project.completedTasks}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
