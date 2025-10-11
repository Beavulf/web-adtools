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

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors?.length) {
//     graphQLErrors.forEach((err) => {
//       console.log("🔥 FULL ERROR OBJECT:", err);
//       const original = err.extensions?.originalError;
//       const msg = Array.isArray(original?.message)
//         ? original.message.join(', ')
//         : original?.message || err.message;
//       console.error("GraphQL error:", msg);
//     });
//   }
//   if (networkError) {
//     console.error('Network Error:', networkError);
//     if (networkError.statusCode === 401) {
//       clearAccessToken();
//       // Можно редиректить на логин
//     }
//   }
// })

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;