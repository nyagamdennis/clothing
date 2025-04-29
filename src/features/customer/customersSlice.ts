/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import getApiUrl from "../../../getApiUrl";


interface Customer {
    id: number;
    name: string;
    phone: string;
}


interface customerState {
    customer: Customer[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
}

const apiUrl = getApiUrl();

const initialState: customerState = {
    customer: [],
    status: "idle",
    error: null,
};



export const fetchCustomers = createAsyncThunk("customer/fetchCustomers", async () => {
    const response = await axios.get<Customer[]>(`${apiUrl}/customers/`);
    return response.data;
});


// export const addDeposit = createAsyncThunk(
//   "cart/addNewDeposit",
//   async (
//     {
//       cartId,
//       newData
//     }: {
//       cartId: number
//       newData: {
//         deposit: number
//       }
//     }
//   ) => {
//     const response = await axios.post(`${apiUrl}/deposit/${cartId}/`, newData)
//     return response.data;
//   }
// )

// export const deliveredSet = createAsyncThunk(
//   "delivered/delivered",
//   async ({
//     cartId,
//     delivered
//   }: {
//     cartId: number
//     delivered: boolean

//   }) => {
//     const response = await axios.put(`${apiUrl}/updatecart/${cartId}/`, {
//       delivered: true
//     })

//     return response.data

//   },
// )

// export const CancelOrder = createAsyncThunk(
//   "cancel/cancelCart",
//   async ({
//     cartId
//   }: {
//     cartId: number
//   }) => {
//     const response = await axios.delete(`${apiUrl}/cancelorder/${cartId}/`)
//     return { message: 'Cart deleted successfully', cartId };
//   }
// )


const customersSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        customerAdded: (state, action: PayloadAction<Customer>) => {
            state.customer.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.customer = action.payload;
                // console.log('cart logs ', action.payload)


                // state.orderCount = action.payload.length;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || null;
            })
        //   .addCase(deliveredSet.pending, (state, action) => {
        //     state.status = "loading"
        //   })
        //   .addCase(deliveredSet.fulfilled, (state, action) => {
        //     state.status = "succeeded"
        //     // state.products.push(action.payload);
        //     state.cart = state.cart.map((car) => {
        //       if (car.id === action.payload.id) {
        //         return action.payload
        //       } else {
        //         return car
        //       }
        //     })
        //   })
        //   .addCase(deliveredSet.rejected, (state, action) => {
        //     state.status = "failed"
        //     state.error = action.error.message
        //   })
        //   .addCase(addDeposit.pending, (state) => {
        //     state.status = 'loading'
        //   })
        //   .addCase(addDeposit.fulfilled, (state, action) => {
        //     state.status = 'succeeded'
        // state.cart = state.cart.map(cart => 
        //   cart.id === action.payload.id ? action.payload : cart
        // );

        //     state.cart = state.cart.map(order => order.id === action.payload.id ? action.payload : order)
        //   })
        //   .addCase(addDeposit.rejected, (state, action) => {
        //     state.error = action.error.message
        //   })
        //   .addCase(CancelOrder.pending, (state) => {
        //     state.status = 'loading'
        //   })
        //   .addCase(CancelOrder.fulfilled, (state, action) => {
        //     state.status = 'succeeded'
        //     const deletedCartId = action.payload.cartId;

        //     // Filter out the deleted cart item from the cart state
        //     state.cart = state.cart.filter(cartItem => cartItem.id !== deletedCartId)
        //   })
        //   .addCase(CancelOrder.rejected, (state, action) => {
        //     state.error = action.error.message
        //   })
    },
});

export const selectAllCustomer = (state: { customer: customerState }) => state.customer.customer;
export const getCustomerStatus = (state: { customer: customerState }) => state.customer.status;
export const getCartError = (state: { customer: customerState }) => state.customer.error;
// export const getOrderCount = (state: { cart: customerState }) => state.cart.orderCount;


export const { customerAdded } = customersSlice.actions;
export default customersSlice.reducer;
