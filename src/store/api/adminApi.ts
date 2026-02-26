import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User, PaginatedResponse, SystemAnalytics } from "../../lib/types";
import type { RootState } from "../store";
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.access;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery,
  tagTypes: ["AdminUsers", "Analytics"],
  endpoints: (builder) => ({
    getAnalytics: builder.query<SystemAnalytics, void>({
      query: () => "admin-analytics/stats/",
      providesTags: ["Analytics"],
    }),
    getAdminUsers: builder.query<PaginatedResponse<User>, { page?: number }>({
      query: ({ page = 1 }) => `users/?page=${page}`,
      providesTags: ["AdminUsers"],
    }),
    updateUserRole: builder.mutation<User, { id: number; role: string }>({
      query: ({ id, role }) => ({ url: `admin/users/${id}/`, method: "PATCH", body: { role } }),
      invalidatesTags: ["AdminUsers"],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `admin/users/${id}/`, method: "DELETE" }),
      invalidatesTags: ["AdminUsers"],
    }),
  }),
});
export const {
  useGetAnalyticsQuery,
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = adminApi;