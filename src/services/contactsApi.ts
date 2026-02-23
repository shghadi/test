import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Contact = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  edited: boolean;
};

export type ContactCreateInput = Omit<Contact, "id" | "edited">;

export type ContactUpdateInput = {
  id: number;
} & Partial<Omit<Contact, "id" | "edited">>;

type ContactsFilter = "all" | "edited" | "notEdited";

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    getContacts: builder.query<Contact[], ContactsFilter>({
      query: (filter) => {
        if (filter === "edited") return "contacts?edited=true";
        if (filter === "notEdited") return "contacts?edited=false";
        return "contacts";
      },
      providesTags: ["Contacts"],
    }),
    createContact: builder.mutation<Contact, ContactCreateInput>({
      query: (body) => ({
        url: "contacts",
        method: "POST",
        body: { ...body, edited: false },
      }),
      invalidatesTags: ["Contacts"],
    }),

    updateContact: builder.mutation<Contact, ContactUpdateInput>({
      query: ({ id, ...patch }) => ({
        url: `contacts/${id}`,
        method: "PATCH",
        body: { ...patch, edited: true },
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
