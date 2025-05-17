import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getService } from '../../constants/Service';
import apiName from '../../constants/ApiName';

// Async thunk to fetch subscription status
export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchSubscriptionStatus',
  async () => {
    try {
      const response = await getService(apiName.getCurrentSubscriptions);
      return response.data; // Assuming response.data contains { status: 'subscribed' | 'trial' | ... }
    } catch (error) {
      throw new Error('Failed to fetch subscription status');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    status: '', // 'subscribed', 'trial', 'trial-expired', 'not-subscribed', etc.
    isLoading: false,
    error: null,
  },
  reducers: {
    // Add other reducers if necessary, for instance resetting status or other actions.
    resetSubscriptionStatus(state) {
      state.status = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscription Status
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.status = action.payload.isActive; 
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Store the error message
      })

  },
});

// Export the actions
export const { resetSubscriptionStatus } = subscriptionSlice.actions;

// Export the reducer
export default subscriptionSlice.reducer;
