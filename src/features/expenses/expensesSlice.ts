/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl"



interface Expenses {
  id: number;
  name: string;
  date_added: string;
}


const apiUrl = getApiUrl()
// Define the allowed values for status
type Status = "idle" | "loading" | "succeeded" | "failed";

// Extend the ExpensesState interface
interface ExpensesState {
  expense: Expenses[];
  status: Status; // For general actions like fetching expense
  error: string | null | undefined; // General error state

  // New properties for addExpenses specific state
  addExpensesStatus: Status; // Specifically for addExpenses loading state
  addExpensesError: string | null | undefined; // Specifically for addExpenses error state

  updateExpensesStatus: Status;
  updateExpensesError: string | null | undefined;


  deleteExpensesStatus: Status;
  deleteExpensesError: string | null | undefined;

 

}

// Define the initial state according to the updated interface
const initialState: ExpensesState = {
  expense: [],
  status: "idle", // Default general status
  error: null, // Default error state

  // Initialize new state properties for addExpenses
  addExpensesStatus: "idle", // Default state for adding expense
  addExpensesError: null, // No error initially for addExpenses

  updateExpensesStatus: 'idle',
  updateExpensesError: null,

  deleteExpensesStatus: 'idle',
  deleteExpensesError: null,

};







export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", async () => {
  const response = await axios.get<Expenses[]>(`${apiUrl}/expenses/`);
  return response.data;
});





export const updateExpenses = createAsyncThunk(
  "expense/updateExpenses",
  async ({ id, updatedData }: { id: number; updatedData: Partial<Expenses> }) => {
    const response = await axios.put(`${apiUrl}/updateExpenses/${id}/`, updatedData); // Assuming you're using PUT to update
    return response.data;
  }
);


export const deleteExpenses = createAsyncThunk(
  "expense/deleteExpenses",
  async ({
    advanceId
  }: {
    advanceId: any
  }) => {

    const response = await axios.delete(`${apiUrl}/deleteEmployee/${advanceId}/`)
    return response.data
  },
)





export const addExpenses = createAsyncThunk(
  "expense/addExpenses",
  async (formData
  ) => {
    const response = await axios.post(`${apiUrl}/addExpenses/`, formData)
    return response.data
  }
)



const expensesSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(addExpenses.pending, (state) => {
        state.addExpensesStatus = 'loading';
      })
      .addCase(addExpenses.fulfilled, (state, action) => {
        state.addExpensesStatus = 'succeeded'
        state.addExpensesError = null;
        state.expense = [action.payload, ...state.expense]
      })
      .addCase(addExpenses.rejected, (state) => {
        state.addExpensesError = 'failed'
      })
      .addCase(updateExpenses.pending, (state) => {
        state.updateExpensesStatus = "loading";
      })
      .addCase(updateExpenses.fulfilled, (state, action: PayloadAction<Expenses>) => {
        state.updateExpensesStatus = "succeeded";
        // Update the specific expense in the array
        state.expense = state.expense.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        );
      })
      .addCase(updateExpenses.rejected, (state, action) => {
        state.updateExpensesStatus = "failed";
        state.updateExpensesError = action.error.message;
      })
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expense = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteExpenses.pending, (state, action) => {
        state.deleteExpensesStatus = "loading"
      })
      .addCase(deleteExpenses.fulfilled, (state, action) => {
        console.log('Success')
        state.deleteExpensesStatus = 'succeeded'
        state.expense = state.expense.filter(expense => expense.id !== action.meta.arg.advanceId);
      })
      .addCase(deleteExpenses.rejected, (state, action) => {
        state.deleteExpensesStatus = 'failed';
        state.deleteExpensesError = action.error.message
      })
      
  },
});

export const selectAllExpenses = (state: { expense: ExpensesState }) => state.expense.expense;
export const getExpensesStatus = (state: { expense: ExpensesState }) => state.expense.status;
export const getExpensesError = (state: { expense: ExpensesState }) => state.expense.error;

export default expensesSlice.reducer;
