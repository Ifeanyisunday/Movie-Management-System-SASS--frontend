import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import type { Inventory, PaginatedResponse } from "../../lib/types";



const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.access;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery,
  tagTypes: ["Inventory"],
  endpoints: (builder) => ({
    getInventory: builder.query<PaginatedResponse<Inventory>, void>({
      query: () => "inventory/",
      providesTags: ["Inventory"],
    }),
    getMovieInventory: builder.query<Inventory | null, number>({
      query: (movieId) => `inventory/?movie=${movieId}`,
      transformResponse: (res: { results: Inventory[] }) => res.results.length > 0 ? res.results[0] : null,
      providesTags: (_r, _e, movieId) => [{ type: "Inventory", id: movieId }],
    }),
    updateInventory: builder.mutation<Inventory, { id: number; total_copies: number; available_copies: number }>({
      query: ({ id, ...body }) => ({
        url: `inventory/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetMovieInventoryQuery,
  useUpdateInventoryMutation,
} = inventoryApi;
