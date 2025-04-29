/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl"



interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_employed: string;
  date_added: string;
}


const apiUrl = getApiUrl()
// Define the allowed values for status
type Status = "idle" | "loading" | "succeeded" | "failed";

// Extend the EmployeesState interface
interface EmployeesState {
  employee: Employee[];
  status: Status; // For general actions like fetching employee
  error: string | null | undefined; // General error state
  employeeExists: boolean; // To track if a employee already exists

  // New properties for addEmployee specific state
  addEmployeeStatus: Status; // Specifically for addEmployee loading state
  addEmployeeError: string | null | undefined; // Specifically for addEmployee error state

  updateEmployeeStatus: Status;
  updateEmployeeError: string | null | undefined;


  deleteThisEmployeeStatus: Status;
  deleteThisEmployeeError: string | null | undefined;



}

// Define the initial state according to the updated interface
const initialState: EmployeesState = {
  employee: [],
  status: "idle", // Default general status
  error: null, // Default error state
  employeeExists: false, // Default state for employee existence

  // Initialize new state properties for addEmployee
  addEmployeeStatus: "idle", // Default state for adding employee
  addEmployeeError: null, // No error initially for addEmployee

  updateEmployeeStatus: 'idle',
  updateEmployeeError: null,

  deleteThisEmployeeStatus: 'idle',
  deleteThisEmployeeError: null,

};



export const checkEmployeeExists = createAsyncThunk(
  "employee/checkEmployeeExists",
  async (employeeName: string) => {
    const response = await axios.get(`${apiUrl}/check_emplyee_exists?name=${employeeName}`);
    return response.data.exists; // Return a boolean value
  }
);



export const fetchEmployees = createAsyncThunk("employees/fetchEmployees", async () => {
  const response = await axios.get<Employee[]>(`${apiUrl}/employees/`);
  return response.data;
});





export const updateThisEmployee = createAsyncThunk(
  "employee/updateThisEmployee",
  async ({ id, updatedData }: { id: number; updatedData: Partial<Employee> }) => {
    console.log('Id ', id)
    const response = await axios.put(`${apiUrl}/updateemployee/${id}/`, updatedData); // Assuming you're using PUT to update
    return response.data;
  }
);


export const deleteThisEmployee = createAsyncThunk(
  "employee/deleteThisEmployee",
  async ({
    employeeId
  }: {
    employeeId: any
  }) => {

    const response = await axios.delete(`${apiUrl}/deleteemployee/${employeeId}/`)
    return response.data
  },
)





export const addEmployee = createAsyncThunk(
  "employee/addEmployee",
  async (formData
  ) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await axios.post(`${apiUrl}/createemployee/`,formData)
    return response.data
  }
)






export const deleteEmployee = createAsyncThunk(
  "employee/addEmployee",
  async (formData
  ) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await axios.post(`${apiUrl}/createemployee/`,formData)
    return response.data
  }
)








const employeesSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    productAdded: (state, action: PayloadAction<Employee>) => {
      state.employee.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addEmployee.pending, (state) => {
        state.addEmployeeStatus = 'loading';
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.addEmployeeStatus = 'succeeded'
        state.addEmployeeError = null;
        state.employee = [action.payload, ...state.employee]
      })
      .addCase(addEmployee.rejected, (state) => {
        state.addEmployeeError = 'failed'
      })
      .addCase(updateThisEmployee.pending, (state) => {
        state.updateEmployeeStatus = "loading";
      })
      .addCase(updateThisEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.updateEmployeeStatus = "succeeded";
        // Update the specific employee in the array
        state.employee = state.employee.map((employee) =>
          employee.id === action.payload.id ? action.payload : employee
        );
      })
      .addCase(updateThisEmployee.rejected, (state, action) => {
        state.updateEmployeeStatus = "failed";
        state.updateEmployeeError = action.error.message;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employee = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteThisEmployee.pending, (state, action) => {
        state.deleteThisEmployeeStatus = "loading"
      })
      .addCase(deleteThisEmployee.fulfilled, (state, action) => {
        console.log('Success')
        state.deleteThisEmployeeStatus = 'succeeded'
        state.employee = state.employee.filter(employee => employee.id !== action.meta.arg.employeeId);
      })
      .addCase(deleteThisEmployee.rejected, (state, action) => {
        state.deleteThisEmployeeStatus = 'failed';
        state.deleteThisEmployeeError = action.error.message
      })
      .addCase(checkEmployeeExists.pending, (state) => {
        state.status = "loading"; // You might want to add a status for checking existence
      })
      .addCase(checkEmployeeExists.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.status = "succeeded";
        state.employeeExists = action.payload; // Add this line to store the existence status
      })
      .addCase(checkEmployeeExists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllEmployee = (state: { employee: EmployeesState }) => state.employee.employee;
export const getEmployeesStatus = (state: { employee: EmployeesState }) => state.employee.status;
export const getEmployeesError = (state: { employee: EmployeesState }) => state.employee.error;

export default employeesSlice.reducer;
