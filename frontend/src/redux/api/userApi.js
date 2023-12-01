import { baseApi } from "./apiSlice";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUser: build.query({
      query: (arg) => ({
        url: "/users",
        params: arg,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getSingleUser: build.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateUser: build.mutation({
      query: (data) => ({
        url: `/users/${data.id}`,
        method: "PATCH",
        data: data.data,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
