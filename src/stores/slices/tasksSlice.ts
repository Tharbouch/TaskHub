import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Task, TaskFormData } from "@/types/task";
import axios from "axios";

interface TasksState {
  items: Task[];
  loading: boolean;
  updating: boolean;
  error: string | null;
  updateError: string | null;
}

const initialState: TasksState = {
  items: [],
  loading: false,
  updating: false,
  error: null,
  updateError: null,
};

// Fetch all tasks for a project
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (projectId?: number) => {
    const url = projectId
      ? `http://localhost:3000/tasks?projectId=${projectId}`
      : "http://localhost:3000/tasks";
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: TaskFormData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/tasks",
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to create task: ${error.response?.data || error.message}`
        );
      }
      throw new Error(`Failed to create task: ${error}`);
    }
  }
);

// Update task status in the database
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }: { id: number; status: Task["status"] }) => {
    console.log(`Updating task ${id} to status ${status}`);

    try {
      const response = await axios.patch(
        `http://localhost:3000/tasks/${id}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Task updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to update task status: ${
            error.response?.data || error.message
          }`
        );
      }
      throw new Error(`Failed to update task status: ${error}`);
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      .addCase(createTask.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.updating = false;
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.error.message || "Failed to create task";
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updatedTask = action.payload;
        const index = state.items.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          state.items[index] = updatedTask;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.updating = false;
        state.updateError =
          action.error.message || "Failed to update task status";
        console.error("Task update failed:", action.error);
      });
  },
});

export default tasksSlice.reducer;
