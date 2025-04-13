import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Project, ProjectFormData } from "@/types/project";
import axios from "axios";

interface ProjectsState {
  items: Project[];
  inProgressProjects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  items: [],
  inProgressProjects: [],
  loading: false,
  error: null,
};

// Async thunk to fetch projects using axios
export const fetchProjects = createAsyncThunk<Project[]>(
  "projects/fetchProjects",
  async () => {
    try {
      const response = await axios.get("http://localhost:3000/projects");
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch projects: ${error.message}`);
      }
      throw new Error("Failed to fetch projects");
    }
  }
);

// Fetch only in-progress projects
export const fetchInProgressProjects = createAsyncThunk<Project[]>(
  "projects/fetchInProgressProjects",
  async () => {
    try {
      const response = await axios.get("http://localhost:3000/projects", {
        params: { status: "in_progress" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching in-progress projects:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch in-progress projects: ${error.message}`
        );
      }
      throw new Error("Failed to fetch in-progress projects");
    }
  }
);

// Using axios to create a new project
export const createProject = createAsyncThunk<Project, ProjectFormData>(
  "projects/createProject",
  async (projectData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/projects",
        {
          ...projectData,
          createdAt: new Date().toISOString(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to create project: ${error.message}`);
      }
      throw new Error("Failed to create project");
    }
  }
);

export const updateProject = createAsyncThunk<
  Project,
  { id: number } & ProjectFormData
>("projects/updateProject", async ({ id, ...projectData }) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/projects/${id}`,
      projectData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to update project: ${error.message}`);
    }
    throw new Error("Failed to update project");
  }
});

// Delete project via API
export const deleteProject = createAsyncThunk<number, number>(
  "projects/deleteProjectApi",
  async (id) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting project:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to delete project: ${error.message}`);
      }
      throw new Error("Failed to delete project");
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed
    deleteProject(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (project) => project.id !== action.payload
      );
      state.inProgressProjects = state.inProgressProjects.filter(
        (project) => project.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
      })
      .addCase(fetchInProgressProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInProgressProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.loading = false;
          state.inProgressProjects = action.payload;
        }
      )
      .addCase(fetchInProgressProjects.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch in-progress projects";
      })
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const index = state.items.findIndex((p) => p.id === updatedProject.id);
        if (index !== -1) {
          state.items[index] = updatedProject;
        }

        // Also update in inProgressProjects if present
        const inProgressIndex = state.inProgressProjects.findIndex(
          (p) => p.id === updatedProject.id
        );
        if (inProgressIndex !== -1) {
          state.inProgressProjects[inProgressIndex] = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update project";
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        const projectId = action.payload;
        state.items = state.items.filter((p) => p.id !== projectId);
        state.inProgressProjects = state.inProgressProjects.filter(
          (p) => p.id !== projectId
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete project";
      });
  },
});

export default projectsSlice.reducer;
