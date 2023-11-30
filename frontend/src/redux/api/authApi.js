import { baseApi } from "./apiSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userSignUp: build.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["user"],
    }),
    userLogin: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useUserLoginMutation, useUserSignUpMutation } = authApi;
