import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Task, TaskFormData } from "@/types/task";
import { tasksApi } from "@/services/api";

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
    return await tasksApi.getAll(projectId);
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: TaskFormData) => {
    return await tasksApi.create(taskData);
  }
);

// Update task status in the database
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }: { id: number; status: Task["status"] }) => {
    console.log(`Updating task ${id} to status ${status}`);
    return await tasksApi.updateStatus(id, status);
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
