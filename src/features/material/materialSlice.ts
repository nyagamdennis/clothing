/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl"



interface Material {
  id: number;
  material: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
  };
  num_of_rolls: number;
  size: number;
  extrasize: number
  total: number;
  date_added: string;
  date_stocked: string;
  buying_price: number;
}


const apiUrl = getApiUrl()
// Define the allowed values for status
type Status = "idle" | "loading" | "succeeded" | "failed";

// Extend the MaterialsState interface
interface MaterialsState {
  material: Material[];
  status: Status; // For general actions like fetching material
  error: string | null | undefined; // General error state
  materialExists: boolean; // To track if a material already exists

  // New properties for addMaterial specific state
  addMaterialStatus: Status; // Specifically for addMaterial loading state
  addMaterialError: string | null | undefined; // Specifically for addMaterial error state

  updateMaterialStatus: Status;
  updateMaterialError: string | null | undefined;


  deleteThisMaterialStatus: Status;
  deleteThisMaterialError: string | null | undefined;



}

// Define the initial state according to the updated interface
const initialState: MaterialsState = {
  material: [],
  status: "idle", // Default general status
  error: null, // Default error state
  materialExists: false, // Default state for material existence

  // Initialize new state properties for addMaterial
  addMaterialStatus: "idle", // Default state for adding material
  addMaterialError: null, // No error initially for addMaterial

  updateMaterialStatus: 'idle',
  updateMaterialError: null,

  deleteThisMaterialStatus: 'idle',
  deleteThisMaterialError: null,


};



export const checkMaterialExists = createAsyncThunk(
  "material/checkMaterialExists",
  async (productName: string) => {
    const response = await axios.get(`${apiUrl}/check_product_exists?name=${productName}`);
    return response.data.exists; // Return a boolean value
  }
);



export const fetchMaterial = createAsyncThunk("material/fetchMaterial", async () => {
  const response = await axios.get<Material[]>(`${apiUrl}/stockprop/`);
  return response.data;
});



export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ orderData }: { orderData: any }) => {
    const response = await axios.post(`${apiUrl}/addcart/`, orderData)
    console.log('Cart response ', response.data)
    return response.data
  },
)



export const updateMaterial = createAsyncThunk(
  "material/updateMaterial",
  async ({ id, updatedData }: { id: number; updatedData: Partial<Material> }) => {
    const response = await axios.put(`${apiUrl}/updateMaterial/${id}/`, updatedData); // Assuming you're using PUT to update
    return response.data;
  }
);


export const deleteThisMaterial = createAsyncThunk(
  "material/deleteThisMaterial",
  async ({
    materialId
  }: {
    materialId: any
  }) => {

    const response = await axios.delete(`${apiUrl}/deletematerial/${materialId}/`)
    return response.data
  },
)



export const addMaterial = createAsyncThunk(
  "material/addMaterial",
  async ({
    name,
  }: {
    name: string
  }
  ) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await axios.post(`${apiUrl}/addMaterial/`, {
      name
    })
    return response.data
  }
)





const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    materialAdded: (state, action: PayloadAction<Material>) => {
      state.material.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMaterial.pending, (state) => {
        state.addMaterialStatus = 'loading';
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.addMaterialStatus = 'succeeded'
        state.addMaterialError = null;
        state.material = [action.payload, ...state.material]
      })
      .addCase(addMaterial.rejected, (state) => {
        state.addMaterialError = 'failed'
      })
      .addCase(updateMaterial.pending, (state) => {
        state.updateMaterialStatus = "loading";
      })
      .addCase(updateMaterial.fulfilled, (state, action: PayloadAction<Material>) => {
        state.updateMaterialStatus = "succeeded";
        // Update the specific material in the array
        state.material = state.material.map((material) =>
          material.id === action.payload.id ? action.payload : material
        );
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.updateMaterialStatus = "failed";
        state.updateMaterialError = action.error.message;
      })
      .addCase(fetchMaterial.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaterial.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.material = action.payload;
      })
      .addCase(fetchMaterial.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })












      .addCase(deleteThisMaterial.pending, (state, action) => {
        state.deleteThisMaterialStatus = "loading"
      })
      .addCase(deleteThisMaterial.fulfilled, (state, action) => {
        console.log('Success')
        state.deleteThisMaterialStatus = 'succeeded'
        state.material = state.material.filter(material => material.id !== action.meta.arg.materialId);
      })
      .addCase(deleteThisMaterial.rejected, (state, action) => {
        state.deleteThisMaterialStatus = 'failed';
        state.deleteThisMaterialError = action.error.message
      })
      .addCase(checkMaterialExists.pending, (state) => {
        state.status = "loading"; // You might want to add a status for checking existence
      })
      .addCase(checkMaterialExists.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.status = "succeeded";
        state.materialExists = action.payload; // Add this line to store the existence status
      })
      .addCase(checkMaterialExists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllMaterials = (state: { material: MaterialsState }) => state.material.material;
export const getMaterialStatus = (state: { material: MaterialsState }) => state.material.status;
export const getMaterialError = (state: { material: MaterialsState }) => state.material.error;

export const { materialAdded } = materialSlice.actions;
export default materialSlice.reducer;