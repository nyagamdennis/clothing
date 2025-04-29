/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl"


interface Prod {
  id: number;
  material: { id: number; name: string };
  color: { id: number; name: string };
  price: number;
  quantity: number;
  size: number;
  date_added: string;
  product: number;
}

interface Product {
  id: number;
  prod: Prod[]; // Ensure this is typed as an array of Prod objects
  name: string;
  date_added: string;
}


const apiUrl = getApiUrl()
// Define the allowed values for status
type Status = "idle" | "loading" | "succeeded" | "failed";

// Extend the ProductsState interface
interface ProductsState {
  products: Product[];
  status: Status; // For general actions like fetching products
  error: string | null | undefined; // General error state
  productExists: boolean; // To track if a product already exists

  // New properties for addProduct specific state
  addProductStatus: Status; // Specifically for addProduct loading state
  addProductError: string | null | undefined; // Specifically for addProduct error state

  updateProductStatus: Status;
  updateProductError: string | null | undefined;


  deleteThisProductStatus: Status;
  deleteThisProductError: string | null | undefined;

  addProductProStatus: Status,
  addProductProError: string | null | undefined;

  deleteProductProStatus: Status;
  deleteProductProError: string | null | undefined;

  updateProductProStatus: Status;
  updateProductProError: string | null | undefined;

  updatedProductProQuantityStatus: Status;
  updatedProductProQuantityError: string | null | undefined;


  addToCartStatus: Status;
  addToCartError: string | null | undefined;

}

// Define the initial state according to the updated interface
const initialState: ProductsState = {
  products: [],
  status: "idle", // Default general status
  error: null, // Default error state
  productExists: false, // Default state for product existence

  // Initialize new state properties for addProduct
  addProductStatus: "idle", // Default state for adding product
  addProductError: null, // No error initially for addProduct

  updateProductStatus: 'idle',
  updateProductError: null,

  deleteThisProductStatus: 'idle',
  deleteThisProductError: null,


  addProductProStatus: 'idle',
  addProductProError: null,


  deleteProductProStatus: 'idle',
  deleteProductProError: null,

  updateProductProStatus: 'idle',
  updateProductProError: null,

  updatedProductProQuantityStatus: 'idle',
  updatedProductProQuantityError: null,

  addToCartStatus: 'idle',
  addToCartError: null,
};



export const checkProductExists = createAsyncThunk(
  "product/checkProductExists",
  async (productName: string) => {
    const response = await axios.get(`${apiUrl}/check_product_exists?name=${productName}`);
    return response.data.exists; // Return a boolean value
  }
);



export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await axios.get<Product[]>(`${apiUrl}/prods/`);
  return response.data;
});



export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({orderData}:{orderData:any}) => {
    const response = await axios.post(`${apiUrl}/addcart/`, orderData)
    console.log('Cart response ', response.data)
    return response.data
  },
)



export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, updatedData }: { id: number; updatedData: Partial<Product> }) => {
    const response = await axios.put(`${apiUrl}/updateproduct/${id}/`, updatedData); // Assuming you're using PUT to update
    return response.data;
  }
);


export const deleteThisProduct = createAsyncThunk(
  "product/deleteThisProduct",
  async ({
    productId
  }: {
    productId: any
  }) => {

    const response = await axios.delete(`${apiUrl}/deleteeproduct/${productId}/`)
    return response.data
  },
)


export const deleteProductPro = createAsyncThunk(
  "product/deleteProductPro",
  async ({
    productProId,
    variationId
  }: {
    productProId: any;
    variationId: any;
  }) => {
    const response = await axios.delete(`${apiUrl}/deleteeproductpro/${variationId}/`)
    return response.data
  },
)


export const addProduct = createAsyncThunk(
  "product/addProduct",
  async ({
    name,
  }: {
    name: string
  }
  ) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await axios.post(`${apiUrl}/addproduct/`, {
      name
    })
    return response.data
  }
)


export const addProductPro = createAsyncThunk(
  "productItem/addProductPro",
  async ({
    product,
    color,
    material,
    size,
    quantity,
    price

  }: {
    product: number,
    material: {
      name: string
    },
    color: {
      name: string
    },
    size: {
      size: string
    },
    quantity: number,
    price: number
  }) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await axios.post(`${apiUrl}/createproduct/`, {
      product,
      color,
      size,
      quantity,
      price,
      material
    })

    return response.data
  },
)

export const updateProductPro = createAsyncThunk(
  "product/updateProductPro",
  async ({ updateProdId, id, updatedData }: {updateProdId:number, id: number; updatedData: Partial<Prod> }) => {
    const response = await axios.put(`${apiUrl}/updateproductpro/${id}/`, updatedData); // Assuming you're using PUT to update
    return response.data;
  }
)

export const updateProductProQuantity = createAsyncThunk(
  "product/updateProductProQuantity",
  async ({ updateProdId, id, updatedData }: {updateProdId:number, id: number; updatedData: Partial<Prod> }) => {
    const response = await axios.put(`${apiUrl}/updateproductproquantity/${id}/`, updatedData); // Assuming you're using PUT to update
    return response.data;
  }
)

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productAdded: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.addProductStatus = 'loading';
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.addProductStatus = 'succeeded'
        state.addProductError = null;
        state.products = [action.payload, ...state.products]
      })
      .addCase(addProduct.rejected, (state) => {
        state.addProductError = 'failed'
      })
      .addCase(updateProduct.pending, (state) => {
        state.updateProductStatus = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.updateProductStatus = "succeeded";
        // Update the specific product in the array
        state.products = state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateProductStatus = "failed";
        state.updateProductError = action.error.message;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addToCart.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.products.push(action.payload);
        state.products = state.products.map((product) => {
          if (product.id === action.payload.id) {
            return action.payload
          } else {
            return product
          }
        })
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(addProductPro.pending, (state, action) => {
        state.addProductProStatus = "loading"
      })
      .addCase(addProductPro.fulfilled, (state, action) => {
        state.addProductProStatus = "succeeded";

        // Update the product in the state
        state.products = state.products.map((product) => {
          if (product.id === action.payload.product) {
            console.log('Found product with id:', product.id);

            // Append the new prod object to the existing prod array
            return {
              ...product,
              prod: [
                ...product.prod,  // Existing product prod array
                action.payload  // New prod data from action.payload
              ]
            };
          } else {
            return product;  // Keep other products unchanged
          }
        });
      })



      .addCase(addProductPro.rejected, (state, action) => {
        state.status = "failed"
        state.addProductProError = action.error.message
        console.log('Error here', action.error.message)
      })
      .addCase(deleteProductPro.pending, (state, action) => {
        state.deleteProductProStatus = "loading"
      })
      .addCase(deleteProductPro.fulfilled, (state, action) => {
        state.deleteProductProStatus = 'succeeded';

        // Extract the productId and variationId from the action payload or arguments
        const { productProId, variationId } = action.meta.arg;

        // Find the product and update the `prod` array by filtering out the deleted variation
        state.products = state.products.map(product => {
          if (product.id === productProId) {
            return {
              ...product,
              prod: product.prod.filter(variation => variation.id !== variationId)
            };
          }
          return product;
        });
      })

      .addCase(deleteProductPro.rejected, (state, action) => {
        state.deleteProductProStatus = 'failed';
        state.deleteProductProError = action.error.message
      })
      .addCase(updateProductPro.pending, (state, action) => {
        state.updateProductProStatus = 'loading';
      })
      .addCase(updateProductPro.fulfilled, (state, action) => {
        state.updateProductProStatus = 'succeeded';
        
        const { updateProdId } = action.meta.arg; // assuming `updateProdId` is the product to update
        
        state.products = state.products.map(product => {
          if (product.id === updateProdId) {
            return {
              ...product, 
              prod: product.prod.map(p => 
                p.id === action.payload.id ? action.payload : p
              ) // Update the specific product variation
            };
          }
          return product;
        });
      })      
      
        
      
      .addCase(updateProductPro.rejected, (state, action) => {
        state.updateProductProError = action.error.message
      })
      .addCase(updateProductProQuantity.pending, (state, action) => {
        state.updatedProductProQuantityStatus = 'loading';
      })
      .addCase(updateProductProQuantity.fulfilled, (state, action) => {
        state.updatedProductProQuantityStatus = 'succeeded';
        
        const { updateProdId } = action.meta.arg; // assuming `updateProdId` is the product to update
        
        state.products = state.products.map(product => {
          if (product.id === updateProdId) {
            return {
              ...product, 
              prod: product.prod.map(p => 
                p.id === action.payload.id ? action.payload : p
              ) // Update the specific product variation
            };
          }
          return product;
        });
      })      
      
        
      
      .addCase(updateProductProQuantity.rejected, (state, action) => {
        state.updatedProductProQuantityError = action.error.message
      })
      .addCase(deleteThisProduct.pending, (state, action) => {
        state.deleteThisProductStatus = "loading"
      })
      .addCase(deleteThisProduct.fulfilled, (state, action) => {
        console.log('Success')
        state.deleteThisProductStatus = 'succeeded'
        state.products = state.products.filter(product => product.id !== action.meta.arg.productId);
      })
      .addCase(deleteThisProduct.rejected, (state, action) => {
        state.deleteThisProductStatus = 'failed';
        state.deleteThisProductError = action.error.message
      })
      .addCase(checkProductExists.pending, (state) => {
        state.status = "loading"; // You might want to add a status for checking existence
      })
      .addCase(checkProductExists.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.status = "succeeded";
        state.productExists = action.payload; // Add this line to store the existence status
      })
      .addCase(checkProductExists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllProducts = (state: { products: ProductsState }) => state.products.products;
export const getProductsStatus = (state: { products: ProductsState }) => state.products.status;
export const getProductsError = (state: { products: ProductsState }) => state.products.error;

export const { productAdded } = productsSlice.actions;
export default productsSlice.reducer;
