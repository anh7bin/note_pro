import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type GetAccessRequestByDocumentQueryVariables = Types.Exact<{
  documentId: Types.Scalars['uuid']['input'];
  requesterId: Types.Scalars['uuid']['input'];
}>;


export type GetAccessRequestByDocumentQuery = { __typename?: 'query_root', access_requests: Array<{ __typename?: 'access_requests', id: string, status?: string | null, permission_type?: string | null, created_at?: string | null, owner_id: string, document: { __typename?: 'blocks', id: string, type: string, content?: any | null, user_id?: string | null } }>, blocks_by_pk?: { __typename?: 'blocks', id: string, user_id?: string | null, type: string, content?: any | null } | null };


export const GetAccessRequestByDocumentDocument = gql`
    query GetAccessRequestByDocument($documentId: uuid!, $requesterId: uuid!) {
  access_requests(
    where: {document_id: {_eq: $documentId}, requester_id: {_eq: $requesterId}}
    order_by: {created_at: desc}
  ) {
    id
    status
    permission_type
    created_at
    owner_id
    document {
      id
      type
      content
      user_id
    }
  }
  blocks_by_pk(id: $documentId) {
    id
    user_id
    type
    content
  }
}
    `;

/**
 * __useGetAccessRequestByDocumentQuery__
 *
 * To run a query within a React component, call `useGetAccessRequestByDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccessRequestByDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccessRequestByDocumentQuery({
 *   variables: {
 *      documentId: // value for 'documentId'
 *      requesterId: // value for 'requesterId'
 *   },
 * });
 */
export function useGetAccessRequestByDocumentQuery(baseOptions: Apollo.QueryHookOptions<GetAccessRequestByDocumentQuery, GetAccessRequestByDocumentQueryVariables> & ({ variables: GetAccessRequestByDocumentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAccessRequestByDocumentQuery, GetAccessRequestByDocumentQueryVariables>(GetAccessRequestByDocumentDocument, options);
      }
export function useGetAccessRequestByDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAccessRequestByDocumentQuery, GetAccessRequestByDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAccessRequestByDocumentQuery, GetAccessRequestByDocumentQueryVariables>(GetAccessRequestByDocumentDocument, options);
        }
export function useGetAccessRequestByDocumentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAccessRequestByDocumentQuery, GetAccessRequestByDocumentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAccessRequestByDocumentQuery, GetAccessRequestByDocumentQueryVariables>(GetAccessRequestByDocumentDocument, options);
        }
export type GetAccessRequestByDocumentQueryHookResult = ReturnType<typeof useGetAccessRequestByDocumentQuery>;
export type GetAccessRequestByDocumentLazyQueryHookResult = ReturnType<typeof useGetAccessRequestByDocumentLazyQuery>;
export type GetAccessRequestByDocumentSuspenseQueryHookResult = ReturnType<typeof useGetAccessRequestByDocumentSuspenseQuery>;
export type GetAccessRequestByDocumentQueryResult = Apollo.QueryResult<GetAccessRequestByDocumentQuery, GetAccessRequestByDocumentQueryVariables>;