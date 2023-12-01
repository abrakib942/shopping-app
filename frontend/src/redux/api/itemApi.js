import { baseApi } from "./apiSlice";

export const itemApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllItems: build.query({
      query: (arg) => ({
        url: "/items",
        params: arg,
        method: "GET",
      }),
      providesTags: ["item"],
    }),
    getSingleItem: build.query({
      query: (id) => ({
        url: `/items/${id}`,
        method: "GET",
      }),
      providesTags: ["item"],
    }),
    createItem: build.mutation({
      query: (data) => ({
        url: "/items/create-item",
        method: "POST",
        data,
      }),
      invalidatesTags: ["item"],
    }),
    updateItem: build.mutation({
      query: ({ id, data }) => ({
        url: `/items/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["item"],
    }),
    deleteItem: build.mutation({
      query: (id) => ({
        url: `/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["item"],
    }),
  }),
});

export const {
  useGetAllItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
  useGetSingleItemQuery,
} = itemApi;
