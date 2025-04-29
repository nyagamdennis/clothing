/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl";
// import Advances

// Define interfaces
interface Advances {
  id: number;
  employee: number;
  amount: string;
  date_issued: string;
  date_given: string;
}

interface Tasks {
  id: number;
  project: number;
  task_name: string;
  estimated_pay: string;
  start_date: string;
  due_date_time: string;
  completed: boolean;
  date_created: string;
  assigned_to: number;
}

interface SingleEmployee {
  id: number;
  tasks: Tasks[];
  advances: Advances[];
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_employed: string;
  date_added: string;
}

const apiUrl = getApiUrl();

// Define allowed values for status
type Status = "idle" | "loading" | "succeeded" | "failed";

// Extend the EmployeeState interface
interface EmployeeState {
  singleEmployee: SingleEmployee | null; // Only one employee at a time
  status: Status;
  error: string | null;

  updateEmployeeStatus: Status;
  updateEmployeeError: string | null;

  deleteThisEmployeeStatus: Status;
  deleteThisEmployeeError: string | null;

  fetchSingleEmployeeStatus: Status;
  fetchSingleEmployeeError: string | null;

  changeTaskStatus: Status;
  changeTaskError: string | null;

  addAnAdvanceStatus: Status;
  addAnAdvanceError: string | null;

  updateTaskCompletionStatus: Status;
  updateTaskCompletionError: string | null | undefined;
}

// Initial state for EmployeeState
const initialState: EmployeeState = {
  singleEmployee: null,
  status: "idle",
  error: null,

  updateEmployeeStatus: 'idle',
  updateEmployeeError: null,

  deleteThisEmployeeStatus: 'idle',
  deleteThisEmployeeError: null,

  fetchSingleEmployeeStatus: 'idle',
  fetchSingleEmployeeError: null,

  changeTaskStatus: 'idle',
  changeTaskError: null,

  addAnAdvanceStatus: 'idle',
  addAnAdvanceError: null,

  updateTaskCompletionStatus: 'idle',
  updateTaskCompletionError: null,
};

// Thunks

// Fetch single employee
export const fetchSingleEmployee = createAsyncThunk<SingleEmployee, number>(
  "singleEmployee/fetchSingleEmployee",
  async (employeeId) => {
    const response = await axios.get<SingleEmployee>(`${apiUrl}/employee/${employeeId}`);
    return response.data;
  }
);

// Change task completion status
interface ChangeTaskStatusParams {
  taskId: number;
  completed: boolean;
}

export const changeTaskCompletionStatus = createAsyncThunk<Tasks, ChangeTaskStatusParams>(
  "singleEmployee/changeTaskCompletionStatus",
  async ({ taskId, completed }) => {
    const response = await axios.put<Tasks>(`${apiUrl}/mark-complete/${taskId}/`, { completed });
    return response.data;
  }
);

export const updateTaskCompletion = createAsyncThunk<Tasks, ChangeTaskStatusParams>(
  "singleEmployee/updateTaskCompletion",
  async ({ taskId, quantityCompleted }) => {
    const response = await axios.put<Tasks>(`${apiUrl}/quantity-complete/${taskId}/`, { task_completed: quantityCompleted });
    return response.data;
  }
);

// export const updateTaskCompletion = async (taskId, quantityCompleted) => {
//   try {
//       const response = await axios.put(`${apiUrl}/quantity-complete/${taskId}/`, {task_completed: quantityCompleted,});
//       console.log("Task updated:", response.data);
//       return response.data
//       // Update the UI or refetch tasks as needed
//   } catch (error) {
//       console.error("Error updating task:", error);
//   }
// };

// Add an advance
interface AdvanceFormData {
  employee: number;
  amount: string;
  date_issued: string;
  date_given: string;
}

export const AddAnAdvance = createAsyncThunk<Advances, AdvanceFormData>(
  "singleEmployee/addAnAdvance",
  async (formData) => {
    const response = await axios.post<Advances>(`${apiUrl}/addAdvance/`, formData);
    return response.data;
  }
);

// Update employee
interface UpdateEmployeeParams {
  id: number;
  updatedData: Partial<SingleEmployee>;
}

export const updateEmployee = createAsyncThunk<SingleEmployee, UpdateEmployeeParams>(
  "singleEmployee/updateEmployee",
  async ({ id, updatedData }) => {
    const response = await axios.put<SingleEmployee>(`${apiUrl}/updateEmployee/${id}/`, updatedData);
    return response.data;
  }
);

// Delete employee
export const deleteThisEmployee = createAsyncThunk<void, { employeeId: number }>(
  "singleEmployee/deleteThisEmployee",
  async ({ employeeId }) => {
    await axios.delete(`${apiUrl}/deleteEmployee/${employeeId}/`);
  }
);

// Slice
const singleEmployeeSlice = createSlice({
  name: "singleEmployee",
  initialState,
  reducers: {
    updateSingleEmployeeAdvance(state, action: PayloadAction<Advance>) {
      if (state.singleEmployee) {
        state.singleEmployee.advances = state.singleEmployee.advances.map((advance) =>
          advance.id === action.payload.id ? action.payload : advance
        );
      }
    },
    updateSingleEmployeeTask(state, action: PayloadAction<Task>) {
      if (state.singleEmployee) {
        state.singleEmployee.tasks = state.singleEmployee.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      }
    },
    removeSingleEmployeeAdvance(state, action: PayloadAction<number>) {
      if (state.singleEmployee) {
        state.singleEmployee.advances = state.singleEmployee.advances.filter(
          (advance) => advance.id !== action.payload
        );
      }
    },
    removeSingleEmployeeTask(state, action: PayloadAction<number>) {
      if (state.singleEmployee) {
        state.singleEmployee.tasks = state.singleEmployee.tasks.filter(
          (task) => task.id !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateEmployee.pending, (state) => {
        state.updateEmployeeStatus = "loading";
      })
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<SingleEmployee>) => {
        state.updateEmployeeStatus = "succeeded";
        if (state.singleEmployee && state.singleEmployee.id === action.payload.id) {
          state.singleEmployee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.updateEmployeeStatus = "failed";
        state.updateEmployeeError = action.error.message ?? null;
      })
      .addCase(deleteThisEmployee.pending, (state) => {
        state.deleteThisEmployeeStatus = "loading";
      })
      .addCase(deleteThisEmployee.fulfilled, (state) => {
        state.deleteThisEmployeeStatus = 'succeeded';
        state.singleEmployee = null;
      })
      .addCase(deleteThisEmployee.rejected, (state, action) => {
        state.deleteThisEmployeeStatus = 'failed';
        state.deleteThisEmployeeError = action.error.message ?? null;
      })
      .addCase(fetchSingleEmployee.pending, (state) => {
        state.fetchSingleEmployeeStatus = 'loading';
      })
      .addCase(fetchSingleEmployee.fulfilled, (state, action: PayloadAction<SingleEmployee>) => {
        state.fetchSingleEmployeeStatus = 'succeeded';
        state.singleEmployee = action.payload;
      })
      .addCase(fetchSingleEmployee.rejected, (state, action) => {
        state.fetchSingleEmployeeError = action.error.message ?? null;
      })
      .addCase(changeTaskCompletionStatus.pending, (state) => {
        state.changeTaskStatus = 'loading';
      })
      .addCase(changeTaskCompletionStatus.fulfilled, (state, action: PayloadAction<Tasks>) => {
        state.changeTaskStatus = 'succeeded';
        if (state.singleEmployee && state.singleEmployee.tasks) {
          state.singleEmployee.tasks = state.singleEmployee.tasks.map((task) =>
            task.id === action.payload.id ? action.payload : task
          );
        }
      })
      .addCase(changeTaskCompletionStatus.rejected, (state, action) => {
        state.changeTaskError = action.error.message ?? null;
      })

      .addCase(updateTaskCompletion.pending, (state) => {
        state.updateTaskCompletionStatus = 'loading';
      })
      .addCase(updateTaskCompletion.fulfilled, (state, action: PayloadAction<Tasks>) => {
        state.updateTaskCompletionStatus = 'succeeded';
        if (state.singleEmployee && state.singleEmployee.tasks) {
          state.singleEmployee.tasks = state.singleEmployee.tasks.map((task) =>
            task.id === action.payload.id ? action.payload : task
          );
        }
      })
      .addCase(updateTaskCompletion.rejected, (state, action) => {
        state.updateTaskCompletionError = action.error.message ?? null;
      })

      .addCase(AddAnAdvance.pending, (state) => {
        state.addAnAdvanceStatus = 'loading';
      })
      .addCase(AddAnAdvance.fulfilled, (state, action: PayloadAction<Advances>) => {
        state.addAnAdvanceStatus = 'succeeded';

        if (state.singleEmployee && state.singleEmployee.advances) {

          state.singleEmployee.advances = [...state.singleEmployee.advances, action.payload];
        }
      })
      .addCase(AddAnAdvance.rejected, (state, action) => {
        state.addAnAdvanceError = action.error.message ?? null;
      });
  },
});

// Selectors
export const selectSingleEmployee = (state: { singleEmployee: EmployeeState }) => state.singleEmployee.singleEmployee;
export const getEmployeesStatus = (state: { singleEmployee: EmployeeState }) => state.singleEmployee.status;
export const getEmployeesError = (state: { singleEmployee: EmployeeState }) => state.singleEmployee.error;


export const { updateSingleEmployeeAdvance, removeSingleEmployeeAdvance, updateSingleEmployeeTask, removeSingleEmployeeTask } = singleEmployeeSlice.actions;


export default singleEmployeeSlice.reducer;