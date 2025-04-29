/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl";

interface Analytics {
    id: number;
    month: number;
    year: number;
    total_sales_amount: string;
    number_of_orders: string;
}

interface AnalyticsState {
  analytics: Analytics[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// const apiUrl = "https://ester.pythonanywhere.com/fastmovingproduct/";
const apiUrl = getApiUrl();

const initialState: AnalyticsState = {
  analytics: [],
  status: "idle",
  error: null,
};



export const fetchAnalytics = createAsyncThunk("nalytics/fetchAnalytics", async () => {
  const response = await axios.get<Analytics[]>(`${apiUrl}/salesanalysis/`);
  console.log('analysis ', response.data)
  return response.data;
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    analyticsAdded: (state, action: PayloadAction<Analytics>) => {
      state.analytics.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const selectAllAnalytics = (state: { analytics: AnalyticsState }) => state.analytics.analytics;
export const getAnalyticsStatus = (state: { analytics: AnalyticsState }) => state.analytics.status;
export const getAnalyticsError = (state: { analytics: AnalyticsState }) => state.analytics.error;

export const { analyticsAdded } = analyticsSlice.actions;
export default analyticsSlice.reducer;