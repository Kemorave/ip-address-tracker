// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { LocationResponce } from '../types/location_res'

// Define a service using a base URL and expected endpoints
export const geoApi = createApi({
  reducerPath: 'geoApi',
  // global configuration for the api
  keepUnusedDataFor: 60*60,
  baseQuery: fetchBaseQuery({ baseUrl: 'https://geo.ipify.org/api/v2' }),
  endpoints: (builder) => ({
    getIpContryAndCity: builder.query<LocationResponce, string>({
      query: (ip) => `country,city?apiKey=at_hyXYL3kaPGHjV5y8i2o1Wbm7GNiAl${ip&&(ip.search(RegExp('[a-z]'))?`&ipAddress=${ip}`:`&domain=${ip}`)}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetIpContryAndCityQuery } = geoApi