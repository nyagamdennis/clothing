import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isCollapsed: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
  },
});

export const { toggleSidebar, setCollapsed } = sidebarSlice.actions;
export default sidebarSlice.reducer;
