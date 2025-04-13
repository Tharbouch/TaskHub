// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./slices/projectsSlice";
import tasksReducer from "./slices/tasksSlice";

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks: tasksReducer,
  },
});

// Export types for later use in selectors and dispatching actions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
