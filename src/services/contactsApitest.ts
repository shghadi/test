import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string;
};

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http:localhost:4000" }),
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    getContacts: builder.query<Contact[], void>({
      query: () => "contact",
      providesTags: ["Contacts"],
    }),
  }),
});
