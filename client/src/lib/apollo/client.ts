import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { nextFetchPolicy } from './cache';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

function getGraphqlEndpoint(endpoint?: string): string {
    if (!endpoint) return '';

    const normalizedEndpoint = endpoint.replace(/\/+$/, '');
    return normalizedEndpoint.endsWith('/v1/graphql')
        ? normalizedEndpoint
        : `${normalizedEndpoint}/v1/graphql`;
}

const httpEndpoint = getGraphqlEndpoint(
    process.env.NEXT_PUBLIC_HASURA_SERVER_ENDPOINT
);
const wsEndpoint =
    getGraphqlEndpoint(process.env.NEXT_PUBLIC_HASURA_WS_ENDPOINT) ||
    httpEndpoint.replace(/^http/, 'ws');

const httpLink = createHttpLink({
    uri: httpEndpoint,
});

const authLink = setContext(async (_, { headers }) => {
    const session = await getSession();
    const token = session?.token;
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const wsLink =
    typeof window !== 'undefined'
        ? new GraphQLWsLink(
              createClient({
                  url: wsEndpoint,
                  connectionParams: async () => {
                      const session = await getSession();
                      if (session?.token) {
                          return {
                              headers: {
                                  Authorization: `Bearer ${session.token}`,
                              },
                          };
                      }
                      return {};
                  },
                  shouldRetry: () => true,
                  retryAttempts: Infinity,
                  connectionAckWaitTimeout: 10000,
                  keepAlive: 15000,
                  retryWait: (retries) => {
                      return new Promise((resolve) => {
                          setTimeout(
                              resolve,
                              Math.min(1000 * 2 ** retries, 30000)
                          );
                      });
                  },
              })
          )
        : null;

const splitLink =
    typeof window !== 'undefined' && wsLink
        ? split(
              ({ query }) => {
                  const definition = getMainDefinition(query);
                  return (
                      definition.kind === 'OperationDefinition' &&
                      definition.operation === 'subscription'
                  );
              },
              wsLink,
              authLink.concat(httpLink)
          )
        : authLink.concat(httpLink);

const TYPE_POLICIES = {
    query_root: {
        fields: {
            blocks: offsetLimitPagination(['where', 'order_by']),
        },
    },
};

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
        typePolicies: TYPE_POLICIES,
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy,
        },
    },
});

export default client;
