import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const clientsAdapter = createEntityAdapter({});

const initialState = clientsAdapter.getInitialState();

export const clientsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: () => "/client",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedClients = responseData
          .map((client) => {
            client.id = client._id;
            return client;
          })
          .sort((a, b) => {
            const dateA = a.updatedAt ?? null;
            const dateB = b.updatedAt ?? null;

            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;
            if (dateA === null || dateB === null) return 0;
            return 0;
          });
        return clientsAdapter.setAll(initialState, loadedClients);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Client", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Client", id })),
          ];
        } else return [{ type: "Client", id: "LIST" }];
      },
    }),
    addNewClient: builder.mutation({
      query: (initialClient) => ({
        url: "/client",
        method: "POST",
        body: {
          ...initialClient,
        },
      }),
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),
    updateClient: builder.mutation({
      query: (initialClient) => ({
        url: "/client",
        method: "PUT",
        body: {
          ...initialClient,
        },
      }),
      invalidatesTags: (result, error, arg) => {
        [{ type: "Client", id: arg.id }];
      },
    }),
    deleteClient: builder.mutation({
      query: ({ id }) => ({
        url: `/client`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Client", id: arg.id }],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useAddNewClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApiSlice;

// returns the query result object
export const selectClientsResult =
  clientsApiSlice.endpoints.getClients.select();

// creates memoized selector
const selectClientsData = createSelector(
  selectClientsResult,
  (clientsResult) => clientsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllClients,
  selectById: selectClientById,
  selectIds: selectClientIds,
  // Pass in a selector that returns the clients slice of state
} = clientsAdapter.getSelectors(
  (state) => selectClientsData(state) ?? initialState
);
