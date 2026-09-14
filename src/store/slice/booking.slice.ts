import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './auth.slice';

interface BookingState {
  myBookings: any[];
  lastUpdated: number | null;
}

const initialState: BookingState = {
  myBookings: [],
  lastUpdated: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setMyBookings: (state, action: PayloadAction<any[]>) => {
      state.myBookings = action.payload || [];
      state.lastUpdated = Date.now();
    },
    clearBookings: (state) => {
      state.myBookings = [];
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.myBookings = [];
      state.lastUpdated = null;
    });
  },
});

export const { setMyBookings, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
