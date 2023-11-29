import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://shopping-4qgvcjv6q-abrakib942.vercel.app/",
  }),
  endpoints: () => ({}),
  tagTypes: [],
});
