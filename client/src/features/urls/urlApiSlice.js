import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const urlsAdapter = createEntityAdapter({});

const initialState = urlsAdapter.getInitialState();

export const urlsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUrls: builder.query({
      query: () => "/url",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedUrls = responseData.map((url) => {
          url.id = url._id;
          return url;
        });
        return urlsAdapter.setAll(initialState, loadedUrls);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Url", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Url", id })),
          ];
        } else return [{ type: "Url", id: "LIST" }];
      },
    }),
    addNewUrl: builder.mutation({
      query: (initialUrl) => ({
        url: "/url",
        method: "POST",
        body: {
          ...initialUrl,
        },
      }),
      invalidatesTags: [{ type: "Url", id: "LIST" }],
    }),
    updateUrl: builder.mutation({
      query: (initialUrl) => ({
        url: "/url",
        method: "PUT",
        body: {
          ...initialUrl,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Url", id: arg.id }],
    }),
    deleteUrl: builder.mutation({
      query: ({ id }) => ({
        url: `/url`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Url", id: arg.id }],
    }),
    refreshRedirect: builder.mutation({
      query: ({ id }) => ({
        url: `/url/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Url", id: arg.urlId }],
    }),
  }),
});

export const {
  useGetUrlsQuery,
  useAddNewUrlMutation,
  useUpdateUrlMutation,
  useDeleteUrlMutation,
  useRefreshRedirectMutation,
} = urlsApiSlice;

// returns the query result object
export const selectUrlsResult = urlsApiSlice.endpoints.getUrls.select();

// creates memoized selector
const selectUrlsData = createSelector(
  selectUrlsResult,
  (urlsResult) => urlsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUrls,
  selectById: selectUrlById,
  selectIds: selectUrlIds,
  // Pass in a selector that returns the urls slice of state
} = urlsAdapter.getSelectors((state) => selectUrlsData(state) ?? initialState);
