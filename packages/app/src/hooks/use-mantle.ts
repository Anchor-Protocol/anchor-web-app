import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const MANTLE_ENDPOINT = process.env.REACT_APP_MANTLE_ENDPOINT
export const mantleConfig = new ApolloClient({
  uri: MANTLE_ENDPOINT || '/',
  cache: new InMemoryCache()
})

export const MantleProvider = ApolloProvider
