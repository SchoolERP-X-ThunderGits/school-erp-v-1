import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from './slices/subscriptionSlice';

const store = configureStore({
  reducer: {
    subscription: subscriptionReducer,
  },
});

export default store;
