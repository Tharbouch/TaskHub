import { useState } from "react";
import ProjectCard from "@/features/projects/components/ProjectCard";
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
import ViewSwitch from "./components/ViewSwitch";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

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
      <h2 className="text-4xl font-bold mb-4">Projects</h2>

      <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tasks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.text}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>
                    <div className=" max-w-xs">
                      <ProjectProgress
                        completedTasks={project.completedTasks}
                        totalTasks={project.totalTasks}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      isComplete={project.completedTasks === project.totalTasks}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {project.completedTasks}/{project.totalTasks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
