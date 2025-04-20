import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch subscription status
export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchSubscriptionStatus',
  async () => {
    try {
      const response = await axios.get('/api/user/status');
      return response.data; // Assuming response.data contains { status: 'subscribed' | 'trial' | ... }
    } catch (error) {
      throw new Error('Failed to fetch subscription status');
    }
  }
);

// Async thunk to handle Razorpay payment and update subscription status
export const updateSubscriptionStatus = createAsyncThunk(
  'subscription/updateSubscriptionStatus',
  async ({ paymentId, signature }) => {
    try {
      const response = await axios.post('/api/razorpay/verify', {
        paymentId,
        signature,
      });
      return response.data; // Assuming this response contains updated subscription status
    } catch (error) {
      throw new Error('Failed to verify Razorpay payment');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    status: 'active', // 'subscribed', 'trial', 'trial-expired', 'not-subscribed', etc.
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
        state.status = action.payload.status; // Assuming payload is { status: 'subscribed' | 'trial' | ... }
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Store the error message
      })

      // Update Subscription Status (e.g., on successful Razorpay payment)
      .addCase(updateSubscriptionStatus.fulfilled, (state, action) => {
        state.status = 'subscribed'; // Assuming the payment was successful and subscription status is 'subscribed'
      })
      .addCase(updateSubscriptionStatus.rejected, (state, action) => {
        state.error = action.error.message; // Handle payment failure if any
      });
  },
});

// Export the actions
export const { resetSubscriptionStatus } = subscriptionSlice.actions;

// Export the reducer
export default subscriptionSlice.reducer;
