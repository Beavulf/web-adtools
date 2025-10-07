import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from '@apollo/client/link/error'

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql", // ваш адрес NestJS GraphQL
});

const getAccessToken = () => localStorage.getItem('token')
const clearAccessToken = () => localStorage.removeItem('token')

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const unauth =
    (graphQLErrors && graphQLErrors.some(e => e.extensions?.code === 'UNAUTHENTICATED')) ||
    (networkError && networkError.statusCode === 401)

  if (unauth) {
    clearAccessToken()
    // жесткий редирект, чтобы гарантированно сбросить состояние
    window.location.replace('/login')
    return
  }
})

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;