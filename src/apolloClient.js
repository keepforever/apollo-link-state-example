import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { withClientState } from "apollo-link-state";

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      setLanguageFilter: (_, { language }, { cache }) => {
        const data = {
          filters: {
            language,
            __typename: "Filters"
          }
        };
        cache.writeData({ data });
        return null;
      }
    }
  },
  defaults: {
    filters: {
      language: null,
      __typename: "Filters"
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.log(
      `[Network error ${operation.operationName}]: ${networkError.message}`
    );
  }
});

const authLink = setContext((_, { headers }) => {
  const context = {
    headers: {
      ...headers,
      Authorization: `bearer ${sessionStorage.getItem("token")}`
    }
  };
  return context;
});

const httpLink = new HttpLink({ uri: "https://api.github.com/graphql" });

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, stateLink, authLink, httpLink]),
  cache
});

export default client;

// 2832bd2f02aa58c7d2e71f9fc55fdba2520c2e7c
