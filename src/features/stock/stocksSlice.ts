/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import getApiUrl from "../../../getApiUrl"
import Stock from "../../pages/Stock"

interface Stock {
  id: number
  material: {
    id: number
    name: string
  }
  color: {
    id: number
    name: string
  }
  num_of_rolls: number
  size: number
  extrasize: number
  total: number
  date_added: string
  date_stocked: string
  buying_price: number
}

type Status = "idle" | "loading" | "succeeded" | "failed"

interface stocksState {
  stocks: Stock[]
  status: Status;
  error: string | null | undefined;
  stockExists: boolean;

  addStockStatus: Status;
  addStockError: string | null | undefined;

  addingNewStockStatus: Status;
  addingNewStockError: string | null | undefined;

  updatingStockStatus: Status;
  updatingStockError: string | null | undefined;

  deleteStockStatus: Status;
  deleteStockError: string | null | undefined;
}

const apiUrl = getApiUrl()


const initialState: stocksState = {
  stocks: [],
  status: 'idle',
  error: null,
  stockExists: false,

  addStockStatus: 'idle',
  addStockError: null,

  addingNewStockStatus: 'idle',
  addingNewStockError: null,

  updatingStockStatus: 'idle',
  updatingStockError: null,

  deleteStockStatus: 'idle',
  deleteStockError: null,
}


export const addingNewStocks = createAsyncThunk(
  "stock/addingnewStock",
  async ({stockData, stockId}:{stockData:{
    size:number; 
    num_of_rolls: number
   },
   stockId: number
  }) => {
    const response = await axios.post(`${apiUrl}/updatestock/${stockId}/`, stockData)
    return response.data
  }
)

export const checkStockExists = createAsyncThunk(
  "stock/checkStockExists",
  async (stockName: string) => {
    const response = await axios.get(`${apiUrl}/check_stock_exists?name=${stockName}`);
    return response.data.exists;
  }
);


export const fetchStock = createAsyncThunk(
  "stocks/fetchStock",
  async () => {
    const response = await axios.get<Stock[]>(`${apiUrl}/stockprop/`)
    return response.data
  },
)


export const updateStock = createAsyncThunk(
  "stock/updateStocks",
  async ({
    num_of_rolls,
    size,
    total,
    stockId,
    buying_price
  }: {
    num_of_rolls: number
    size: number
    total: number
    stockId: number
    buying_price: number
  }) => {
    const response = await axios.put(`${apiUrl}/updatestock/${stockId}/`, {
      num_of_rolls,
      size,
      total,
      buying_price,
    })
    return response.data
  },
)


export const addNewStock = createAsyncThunk(
  "addNewStock/addStocks",
  async ({
    material,
    color,
    num_of_rolls,
    size,
    date_stocked,
    buying_price,
  }: {
    num_of_rolls: string
    size: number
    total: number
    stockId: number
    buying_price: string
    date_stocked: string
    material: {
      name: string
    }
    color: {
      name: string
    }
  }) => {
    const response = await axios.post(`${apiUrl}/createstock/`, {
      num_of_rolls,
      size,
      material,
      date_stocked,
      buying_price,
      color,
    })
    return response.data
  },
)


export const updatingStock = createAsyncThunk(
  "stock/updatingStock", 
  async({
    stockId,
    updateData
  }:{
    stockId: number;
    updateData: {
      num_of_rolls: string;
      size: number;
      total: number;
      stockId: number;
      buying_price: string;
      date_stocked: string;
      material: {
        name: string;
      };
      color: {
        name: string;
      };
    };
  }) => {
    console.log('updates ', updateData)
    const response = await axios.put(`${apiUrl}/updateallstocks/${stockId}/`, updateData)
    return response.data
  }
)

export const deleteStocks = createAsyncThunk(
  "stock/deleteStocks",
  async({stockId}:{stockId:number}) => {
    const response = await axios.delete(`${apiUrl}/deleteallstock/${stockId}/`)
    return response.data
  }
)

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    stockAdded: (state, action: PayloadAction<Stock>) => {
      state.stocks.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStock.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.stocks = action.payload
      })
      .addCase(fetchStock.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || null
      })
      .addCase(updateStock.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.stocks = state.stocks.map((stock) => {
          if (stock.id === action.payload.id) {
            return action.payload
          } else {
            return stock
          }
        })
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(addNewStock.pending, (state, action) => {
        state.addStockStatus = "loading"
      })
      .addCase(addNewStock.fulfilled, (state, action) => {
        state.addStockStatus = "succeeded"
        state.stocks = [action.payload, ...state.stocks]
        // state.stocks.push(action.payload);
      })
      .addCase(addNewStock.rejected, (state, action) => {
        state.status = "failed"
        state.addStockError = action.error.message
      })
      .addCase(checkStockExists.pending, (state) => {
        state.status = "loading"; // You might want to add a status for checking existence
      })
      .addCase(checkStockExists.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.status = "succeeded";
        state.stockExists = action.payload; // Add this line to store the existence status
      })
      .addCase(checkStockExists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addingNewStocks.pending, (state) =>{
        state.addingNewStockStatus = 'loading';
      })
      .addCase(addingNewStocks.fulfilled, (state, action) => {
        state.addingNewStockStatus = 'succeeded';
        state.stocks = state.stocks.map((stock) => {
          if (stock.id === action.payload.id) {
            return action.payload
          } else {
            return stock
          }
        })
      })
      .addCase(addingNewStocks.rejected, (state, action) => {
        state.addingNewStockError = action.error.message
      })
      .addCase(updatingStock.pending, (state) => {
        state.addingNewStockStatus = 'loading'
      } )
      .addCase(updatingStock.fulfilled, (state, action) => {
        state.addingNewStockStatus = 'succeeded';
        state.stocks = state.stocks.map((stock) => {
          if (stock.id === action.payload.id) {
            return action.payload
          } else {
            return stock
          }
        })
      })
      .addCase(updatingStock.rejected, (state, action) => {
        state.addingNewStockError = action.error.message
      })
      .addCase(deleteStocks.pending, (state) => {
        state.deleteStockStatus = 'loading';
      })
      .addCase(deleteStocks.fulfilled, (state, action) => {
        state.deleteStockStatus = 'succeeded';
        state.stocks = state.stocks.filter(stock => stock.id !== action.meta.arg.stockId);
      })
      .addCase(deleteStocks.rejected, (state, action) => {
        state.deleteStockStatus = 'failed';
        state.deleteStockError = action.error.message
      })
      
  },
})

export const selectAllStocks = (state: { stocks: stocksState }) =>
  state.stocks.stocks
export const getStocksStatus = (state: { stocks: stocksState }) =>
  state.stocks.status
export const getStocksError = (state: { stocks: stocksState }) =>
  state.stocks.error

export const { stockAdded } = stocksSlice.actions
export default stocksSlice.reducer