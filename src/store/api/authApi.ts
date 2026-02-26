import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AuthTokens, LoginCredentials, RegisterData, User, PasswordChangeData, ProfileUpdateData } from "../../lib/types";
import type { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.access;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});


export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Profile", "Users"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthTokens, LoginCredentials>({
      query: (creds) => ({ url: "auth/login/", method: "POST", body: creds }),
    }),
    register: builder.mutation<User, RegisterData>({
      query: (data) => ({ url: "auth/register/", method: "POST", body: data }),
    }),
    getProfile: builder.query<User, void>({
      query: () => "users/me/",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<User, ProfileUpdateData>({
      query: (data) => ({ url: "users/me/", method: "PATCH", body: data }),
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation<void, PasswordChangeData>({
      query: (data) => ({ url: "users/me/change-password/", method: "POST", body: data }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
