import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string;
};

export type ContactCreate = Omit<Contact, "id">;

export type ContactUpdate = Partial<ContactCreate> & { id: number };

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    getContacts: builder.query<Contact[], void>({
      query: () => "contacts",
      providesTags: ["Contacts"],
    }),
    createContact: builder.mutation<Contact, ContactCreate>({
      query: (body) => ({ url: "contacts", method: "POST", body }),
      invalidatesTags: ["Contacts"],
    }),
    updateContact: builder.mutation<Contact, ContactUpdate>({
      query: ({ id, ...patch }) => ({
        url: `contacts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Contacts"],
    }),
    deleteContact: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `contacts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Contacts"],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactsApi;
