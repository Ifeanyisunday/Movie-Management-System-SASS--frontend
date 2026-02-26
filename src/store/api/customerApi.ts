import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User, PaginatedResponse } from "../../lib/types";
import type { RootState } from "../store";
import { BACKEND_URL } from "../../config/api";


const baseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.access;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery,
  tagTypes: ["Customers"],
  endpoints: (builder) => ({
    getCustomers: builder.query<PaginatedResponse<User>, { page?: number }>({
      query: ({ page = 1 }) => `customers/?page=${page}`,
      providesTags: ["Customers"],
    }),
  }),
});

export const { useGetCustomersQuery } = customerApi;
