import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Rental, PaginatedResponse } from "../../lib/types";
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

export const rentalApi = createApi({
  reducerPath: "rentalApi",
  baseQuery,
  tagTypes: ["Rental"],
  endpoints: (builder) => ({
    getMyRentals: builder.query<PaginatedResponse<Rental>, { page?: number }>({
      query: ({ page = 1 }) => `rentals/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Rental" as const,
                id,
              })),
              { type: "Rental", id: "LIST" },
            ]
          : [{ type: "Rental", id: "LIST" }],
    }),
    getAllRentals: builder.query<PaginatedResponse<Rental>, { page?: number }>({
      query: ({ page = 1 }) => `rentals/?page=${page}`,
      providesTags: (result) =>
          result
            ? [
                ...result.results.map((rental) => ({
                  type: "Rental" as const,
                  id: rental.id,
                })),
                { type: "Rental" as const, id: "LIST" },
              ]
            : [{ type: "Rental" as const, id: "LIST" }],
    }),
    rentMovie: builder.mutation<Rental, number>({
      query: (movieId) => ({ url: "rentals/", method: "POST", body: { movie: movieId } }),
      invalidatesTags: [{ type: "Rental", id: "LIST" }],
    }),
    returnMovie: builder.mutation<Rental, number>({
      query: (rentalId) => ({ url: `rentals/${rentalId}/return_movie/`, method: "POST" }),
      invalidatesTags: [{ type: "Rental", id: "LIST" }],
    }),
    getVendorRentals: builder.query<PaginatedResponse<Rental>, { page?: number }>({
      query: ({ page = 1 }) => `rentals/vendor/?page=${page}`,
      providesTags: ["Rental"],
    }),
  }),
});

export const {
  useGetMyRentalsQuery,
  useGetAllRentalsQuery,
  useRentMovieMutation,
  useReturnMovieMutation,
  useGetVendorRentalsQuery,
} = rentalApi;
