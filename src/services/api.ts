import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Project, ProjectFormData } from "@/types/project";
import { Task, TaskFormData } from "@/types/task";

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handling helper
const handleApiError = (error: unknown, defaultMessage: string): never => {
  console.error(defaultMessage, error);
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    throw new Error(
      `${defaultMessage}: ${axiosError.response?.data || axiosError.message}`
    );
  }
  throw new Error(`${defaultMessage}: ${error}`);
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    try {
      const response = await apiClient.get("/projects");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch projects");
    }
  },

  getInProgress: async (): Promise<Project[]> => {
    try {
      const response = await apiClient.get("/projects", {
        params: { status: "in_progress" },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch in-progress projects");
    }
  },

  create: async (projectData: ProjectFormData): Promise<Project> => {
    try {
      const response = await apiClient.post("/projects", {
        ...projectData,
        createdAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to create project");
    }
  },

  update: async (
    id: number,
    projectData: ProjectFormData
  ): Promise<Project> => {
    try {
      const response = await apiClient.patch(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to update project");
    }
  },

  delete: async (id: number): Promise<number> => {
    try {
      await apiClient.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return handleApiError(error, "Failed to delete project");
    }
  },
};

// Tasks API
export const tasksApi = {
  getAll: async (projectId?: number): Promise<Task[]> => {
    try {
      const config: AxiosRequestConfig = {};
      if (projectId) {
        config.params = { projectId };
      }

      const response = await apiClient.get("/tasks", config);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch tasks");
    }
  },

  create: async (taskData: TaskFormData): Promise<Task> => {
    try {
      const response = await apiClient.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to create task");
    }
  },

  updateStatus: async (id: number, status: Task["status"]): Promise<Task> => {
    try {
      const response = await apiClient.patch(`/tasks/${id}`, { status });
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to update task status");
    }
  },

  update: async (
    id: number,
    taskData: Partial<TaskFormData>
  ): Promise<Task> => {
    try {
      const response = await apiClient.patch(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to update task");
    }
  },

  delete: async (id: number): Promise<number> => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      return handleApiError(error, "Failed to delete task");
    }
  },
};
