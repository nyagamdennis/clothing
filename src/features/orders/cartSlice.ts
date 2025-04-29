/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl";


interface Cart {
  id: number;
  customer: {
    id: number;
    name: string;
    phone: string;
  };
  product: {
    id: number;
    product: {
      id: number;
      name: string;
    };
    color: {
      id: number;
      name: string;
    }
    material: {
      id: number;
      name: string;
    };
    num_of_rolls: number;
    size: number;
    extrasize: number;
    total: number;
    date_stocked: string;
    date_added: string;
  };
  mode_of_payment: string;
  delivered: boolean;
  quantity: number;
  to_be_delivered_to: string;
  no_to_be_delivered: number;
  fully_payed: boolean;
  deposited: number;
  due_date: string;
  date: string
  last_updated: string;
}


interface cartState {
  cart: Cart[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
  orderCount: number;
}

const apiUrl = getApiUrl();

const initialState: cartState = {
  cart: [],
  status: "idle",
  error: null,
  orderCount: 0,
};



export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await axios.get<Cart[]>(`${apiUrl}/cart/`);
  return response.data;
});


export const addDeposit = createAsyncThunk(
  "cart/addNewDeposit",
  async (
    {
      cartId,
      newData
    }: {
      cartId: number
      newData: {
        deposit: number
      }
    }
  ) => {
    const response = await axios.post(`${apiUrl}/deposit/${cartId}/`, newData)
    return response.data;
  }
)

export const deliveredSet = createAsyncThunk(
  "delivered/delivered",
  async ({
    cartId,
    delivered
  }: {
    cartId: number
    delivered: boolean

  }) => {
    const response = await axios.put(`${apiUrl}/updatecart/${cartId}/`, {
      delivered: true
    })

    return response.data

  },
)

export const CancelOrder = createAsyncThunk(
  "cancel/cancelCart",
  async ({
    cartId
  }: {
    cartId: number
  }) => {
    const response = await axios.delete(`${apiUrl}/cancelorder/${cartId}/`)
    // return response.data
    return { message: 'Cart deleted successfully', cartId };
  }
)


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartAdded: (state, action: PayloadAction<Cart>) => {
      state.cart.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        // console.log('cart logs ', action.payload)
        
        
        state.orderCount = action.payload.length;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deliveredSet.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(deliveredSet.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.products.push(action.payload);
        state.cart = state.cart.map((car) => {
          if (car.id === action.payload.id) {
            return action.payload
          } else {
            return car
          }
        })
      })
      .addCase(deliveredSet.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(addDeposit.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addDeposit.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // state.cart = state.cart.map(cart => 
        //   cart.id === action.payload.id ? action.payload : cart
        // );

        state.cart = state.cart.map(order => order.id === action.payload.id ? action.payload : order)
      })
      .addCase(addDeposit.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(CancelOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(CancelOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const deletedCartId = action.payload.cartId;

        // Filter out the deleted cart item from the cart state
        state.cart = state.cart.filter(cartItem => cartItem.id !== deletedCartId)
      })
      .addCase(CancelOrder.rejected, (state, action) => {
        state.error = action.error.message
      })
  },
});

export const selectAllCart = (state: { cart: cartState }) => state.cart.cart;
export const getCartStatus = (state: { cart: cartState }) => state.cart.status;
export const getCartError = (state: { cart: cartState }) => state.cart.error;
export const getOrderCount = (state: { cart: cartState }) => state.cart.orderCount;


export const { cartAdded } = cartSlice.actions;
export default cartSlice.reducer;
