/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl"
import { removeSingleEmployeeTask, updateSingleEmployeeTask } from "../employees/singleEmployeeSlice";



interface Roles {
  id: number;
  project: {
    id: number;
    name: string
  }
    task_name: string;
    estimated_pay: number;
    start_date: string;
    due_date_time: string;
    completed: boolean;
    date_created: string;
    assigned_to: number;
}


const apiUrl = getApiUrl()
// Define the allowed values for status
type Status = "idle" | "loading" | "succeeded" | "failed";

// Extend the RolesState interface
interface RolesState {
  roles: Roles[];
  status: Status; // For general actions like fetching roles
  error: string | null | undefined; // General error state
  productExists: boolean; // To track if a Roles already exists

  fetchRoleStatus: Status;
  fetchRoleError: string | null | undefined

  fetchProjectStatus: Status;
  fetchProjectError: string | null | undefined;

  addRolesStatus: Status;
  addRolesError: string | null | undefined;

  updateRolesStatus: Status;
  updateRolesError: string | null | undefined;

  deleteRolesStatus: Status;
  deleteRolesError: string | null | undefined;

}

// Define the initial state according to the updated interface
const initialState: RolesState = {
  roles: [],
  status: "idle", // Default general status
  error: null, // Default error state
  productExists: false, // Default state for Roles existence

  fetchRoleStatus: 'idle',
  fetchRoleError: null,

  fetchProjectStatus: 'idle',
  fetchProjectError: null,

  addRolesStatus: "idle",
  addRolesError: null,

  updateRolesStatus: "idle",
  updateRolesError: null,

  deleteRolesStatus: 'idle',
  deleteRolesError: null,
};


export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const response = await axios.get<Roles[]>(`${apiUrl}/tasks/`);
  return response.data;
});


export const addRoles = createAsyncThunk("roles/addRoles", async (formData) => {
  const response = await axios.post(`${apiUrl}/create-task/`, formData);
  return response.data;
})


export const UpdateRoles = createAsyncThunk("roles/UpdateRoles", async ({id, updatedData}:{id: number; updatedData: Partial<Roles> }, {dispatch}) => {
  const response = await axios.put(`${apiUrl}/mark-complete/${id}/`, updatedData);
  // return response.data;
  const updatedTask = response.data
    dispatch(updateSingleEmployeeTask(updatedTask));
    return updatedTask;
})


export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async ({
    taskId
  }: {
    taskId: any
  }, {dispatch}) => {
    await axios.delete(`${apiUrl}/deletetask/${taskId}/`)

    dispatch(removeSingleEmployeeTask(taskId));
    return taskId
  },
)


const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.fetchRoleStatus = 'loading';
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.fetchRoleStatus = 'succeeded'
        state.roles = action.payload
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.fetchRoleError = action.error.message
      })
      .addCase(addRoles.pending, (state) => {
        state.addRolesStatus = 'loading';
      })
      .addCase(addRoles.fulfilled, (state, action) => {
        state.addRolesStatus = 'succeeded';
        state.roles = [...state.roles, action.payload]
      })
      .addCase(addRoles.rejected, (state, action) => {
        state.addRolesError = action.error.message
      })
      .addCase(UpdateRoles.pending, (state) => {
        state.updateRolesStatus = 'loading'
      })
      .addCase(UpdateRoles.fulfilled, (state, action) => {
        state.updateRolesStatus = 'succeeded'
        if (state.singleEmployee) {
          state.singleEmployee.tasks = state.singleEmployee.tasks.map((task) =>
              task.id === action.payload.id ? action.payload : task
          );
      }
      })
      .addCase(UpdateRoles.rejected, (state, action) => {
        state.updateRolesError = action.error.message
      })
      .addCase(deleteRole.pending, (state) => {
        state.deleteRolesStatus = 'loading'
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.deleteRolesStatus = 'succeeded'
        state.tasks = state.tasks.filter(task => task.id !== action.meta.arg.taskId);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.deleteRolesError = action.error.message
      })

  },
});

export const selectAllRoles = (state: { roles: RolesState }) => state.roles.roles;
export const getProductsStatus = (state: { roles: RolesState }) => state.roles.status;
export const getProductsError = (state: { roles: RolesState }) => state.roles.error;

export default rolesSlice.reducer;
