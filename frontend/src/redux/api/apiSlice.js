import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../helpers/axios/axiosBaseQuery";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: "https://shopping-app-opal.vercel.app/api/v1",
    // baseUrl: "http://localhost:5000/api/v1",
  }),
  endpoints: () => ({}),
  tagTypes: ["user", "item"],
});
