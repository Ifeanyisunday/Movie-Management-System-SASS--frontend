import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Movie, PaginatedResponse, MovieFormData } from "../../lib/types";
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

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery,
  tagTypes: ["Movies", "Movie"],
  endpoints: (builder) => ({
    getMovies: builder.query<PaginatedResponse<Movie>, { page?: number; search?: string; genre?: string }>({
      query: ({ page = 1, search, genre }) => {
        const params = new URLSearchParams({ page: String(page) });
        if (search) params.set("search", search);
        if (genre) params.set("genre", genre);
        return `movies/?${params}`;
      },
      providesTags: ["Movies"],
    }),
    getMovie: builder.query<Movie, number>({
      query: (id) => `movies/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "Movie", id }],
    }),
    createMovie: builder.mutation<Movie, MovieFormData>({
      query: (data) => ({ url: "movies/", method: "POST", body: data }),
      invalidatesTags: ["Movies"],
    }),
    updateMovie: builder.mutation<Movie, { id: number; data: Partial<MovieFormData> }>({
      query: ({ id, data }) => ({ url: `movies/${id}/`, method: "PATCH", body: data }),
      invalidatesTags: (_r, _e, { id }) => ["Movies", { type: "Movie", id }],
    }),
    deleteMovie: builder.mutation<void, number>({
      query: (id) => ({ url: `movies/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Movies"],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = movieApi;
