import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type SearchAllQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
  searchTerm: Types.Scalars['String']['input'];
  userId: Types.Scalars['uuid']['input'];
}>;


export type SearchAllQuery = { __typename?: 'query_root', folders: Array<{ __typename?: 'folders', id: string, name: string, user?: { __typename?: 'users', id: string, avatar_url?: string | null } | null, workspace?: { __typename?: 'workspaces', id: string, name?: string | null } | null }>, documents: Array<{ __typename?: 'blocks', id: string, content?: any | null, user?: { __typename?: 'users', id: string, avatar_url?: string | null } | null, workspace?: { __typename?: 'workspaces', id: string, name?: string | null } | null }>, sharedDocuments: Array<{ __typename?: 'blocks', id: string, content?: any | null, workspace_id?: string | null, user?: { __typename?: 'users', id: string, name?: string | null, avatar_url?: string | null } | null }> };


export const SearchAllDocument = gql`
    query SearchAll($workspaceId: uuid!, $searchTerm: String!, $userId: uuid!) {
  folders(
    where: {workspace_id: {_eq: $workspaceId}, _or: [{name: {_ilike: $searchTerm}}, {description: {_ilike: $searchTerm}}]}
    limit: 20
    order_by: {created_at: desc}
  ) {
    id
    name
    user {
      id
      avatar_url
    }
    workspace {
      id
      name
    }
  }
  documents: blocks(
    where: {workspace_id: {_eq: $workspaceId}, type: {_eq: "page"}, deleted_at: {_is_null: true}, content: {_cast: {String: {_ilike: $searchTerm}}}}
    limit: 20
    order_by: {updated_at: desc}
  ) {
    id
    content
    user {
      id
      avatar_url
    }
    workspace {
      id
      name
    }
  }
  sharedDocuments: blocks(
    where: {type: {_eq: "page"}, deleted_at: {_is_null: true}, content: {_cast: {String: {_ilike: $searchTerm}}}, access_requests: {requester_id: {_eq: $userId}, status: {_eq: "approved"}}}
    limit: 20
    order_by: {updated_at: desc}
  ) {
    id
    content
    workspace_id
    user {
      id
      name
      avatar_url
    }
  }
}
    `;

/**
 * __useSearchAllQuery__
 *
 * To run a query within a React component, call `useSearchAllQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchAllQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchAllQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      searchTerm: // value for 'searchTerm'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useSearchAllQuery(baseOptions: Apollo.QueryHookOptions<SearchAllQuery, SearchAllQueryVariables> & ({ variables: SearchAllQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchAllQuery, SearchAllQueryVariables>(SearchAllDocument, options);
      }
export function useSearchAllLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchAllQuery, SearchAllQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchAllQuery, SearchAllQueryVariables>(SearchAllDocument, options);
        }
export function useSearchAllSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchAllQuery, SearchAllQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchAllQuery, SearchAllQueryVariables>(SearchAllDocument, options);
        }
export type SearchAllQueryHookResult = ReturnType<typeof useSearchAllQuery>;
export type SearchAllLazyQueryHookResult = ReturnType<typeof useSearchAllLazyQuery>;
export type SearchAllSuspenseQueryHookResult = ReturnType<typeof useSearchAllSuspenseQuery>;
export type SearchAllQueryResult = Apollo.QueryResult<SearchAllQuery, SearchAllQueryVariables>;