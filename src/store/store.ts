import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import { authApi } from "./api/authApi";
import { movieApi } from "./api/movieApi";
import { rentalApi } from "./api/rentalApi";
import { customerApi } from "./api/customerApi";
import { adminApi } from "./api/adminApi";
import { inventoryApi } from "./api/inventoryApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [rentalApi.reducerPath]: rentalApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      movieApi.middleware,
      rentalApi.middleware,
      customerApi.middleware,
      adminApi.middleware,
      inventoryApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
