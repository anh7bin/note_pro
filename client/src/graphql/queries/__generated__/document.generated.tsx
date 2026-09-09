import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type GetAllDocsQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetAllDocsQuery = { __typename?: 'query_root', blocks: Array<{ __typename?: 'blocks', id: string, content?: any | null, cover_image?: string | null, created_at?: string | null, updated_at?: string | null, workspace_id?: string | null, user_id?: string | null, folder?: { __typename?: 'folders', id: string, name: string } | null, sub_blocks: Array<{ __typename?: 'blocks', id: string, type: string, content?: any | null, tasks: Array<{ __typename?: 'tasks', id: string, status?: string | null, schedule_date?: string | null, deadline_date?: string | null }> }> }> };

export type GetDocumentBlocksQueryVariables = Types.Exact<{
  pageId: Types.Scalars['uuid']['input'];
}>;


export type GetDocumentBlocksQuery = { __typename?: 'query_root', blocks: Array<{ __typename?: 'blocks', id: string, content?: any | null, cover_image?: string | null, position?: number | null, parent_id?: string | null, page_id?: string | null, type: string, workspace_id?: string | null, user_id?: string | null, created_at?: string | null, updated_at?: string | null, link_access?: { __typename?: 'document_link_access', permission_type: string } | null, tasks: Array<{ __typename?: 'tasks', id: string, status?: string | null, deadline_date?: string | null, schedule_date?: string | null, priority?: string | null, user_id?: string | null }> }> };

export type GetDocsCountQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetDocsCountQuery = { __typename?: 'query_root', blocks_aggregate: { __typename?: 'blocks_aggregate', aggregate?: { __typename?: 'blocks_aggregate_fields', count: number } | null } };

export type GetSharedWithMeDocsQueryVariables = Types.Exact<{
  userId: Types.Scalars['uuid']['input'];
}>;


export type GetSharedWithMeDocsQuery = { __typename?: 'query_root', blocks: Array<{ __typename?: 'blocks', id: string, content?: any | null, cover_image?: string | null, created_at?: string | null, updated_at?: string | null, user_id?: string | null, workspace_id?: string | null, folder?: { __typename?: 'folders', id: string, name: string } | null, sub_blocks: Array<{ __typename?: 'blocks', id: string, type: string, content?: any | null, position?: number | null, tasks: Array<{ __typename?: 'tasks', id: string, status?: string | null, schedule_date?: string | null, deadline_date?: string | null }> }>, access_requests: Array<{ __typename?: 'access_requests', permission_type?: string | null, status?: string | null }> }> };


export const GetAllDocsDocument = gql`
    query GetAllDocs($workspaceId: uuid!) {
  blocks(
    where: {workspace_id: {_eq: $workspaceId}, type: {_eq: "page"}, deleted_at: {_is_null: true}}
    order_by: {updated_at: desc}
  ) {
    id
    content
    cover_image
    created_at
    updated_at
    workspace_id
    user_id
    folder {
      id
      name
    }
    sub_blocks(order_by: {position: asc}, limit: 10) {
      id
      type
      content
      tasks {
        id
        status
        schedule_date
        deadline_date
      }
    }
  }
}
    `;

/**
 * __useGetAllDocsQuery__
 *
 * To run a query within a React component, call `useGetAllDocsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllDocsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllDocsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAllDocsQuery(baseOptions: Apollo.QueryHookOptions<GetAllDocsQuery, GetAllDocsQueryVariables> & ({ variables: GetAllDocsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllDocsQuery, GetAllDocsQueryVariables>(GetAllDocsDocument, options);
      }
export function useGetAllDocsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllDocsQuery, GetAllDocsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllDocsQuery, GetAllDocsQueryVariables>(GetAllDocsDocument, options);
        }
export function useGetAllDocsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllDocsQuery, GetAllDocsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllDocsQuery, GetAllDocsQueryVariables>(GetAllDocsDocument, options);
        }
export type GetAllDocsQueryHookResult = ReturnType<typeof useGetAllDocsQuery>;
export type GetAllDocsLazyQueryHookResult = ReturnType<typeof useGetAllDocsLazyQuery>;
export type GetAllDocsSuspenseQueryHookResult = ReturnType<typeof useGetAllDocsSuspenseQuery>;
export type GetAllDocsQueryResult = Apollo.QueryResult<GetAllDocsQuery, GetAllDocsQueryVariables>;
export const GetDocumentBlocksDocument = gql`
    query GetDocumentBlocks($pageId: uuid!) {
  blocks(
    where: {_or: [{id: {_eq: $pageId}}, {page_id: {_eq: $pageId}}], deleted_at: {_is_null: true}}
    order_by: {position: asc}
  ) {
    id
    content
    cover_image
    position
    parent_id
    page_id
    type
    workspace_id
    user_id
    created_at
    updated_at
    link_access {
      permission_type
    }
    tasks {
      id
      status
      deadline_date
      schedule_date
      priority
      user_id
    }
  }
}
    `;

/**
 * __useGetDocumentBlocksQuery__
 *
 * To run a query within a React component, call `useGetDocumentBlocksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentBlocksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentBlocksQuery({
 *   variables: {
 *      pageId: // value for 'pageId'
 *   },
 * });
 */
export function useGetDocumentBlocksQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables> & ({ variables: GetDocumentBlocksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>(GetDocumentBlocksDocument, options);
      }
export function useGetDocumentBlocksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>(GetDocumentBlocksDocument, options);
        }
export function useGetDocumentBlocksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>(GetDocumentBlocksDocument, options);
        }
export type GetDocumentBlocksQueryHookResult = ReturnType<typeof useGetDocumentBlocksQuery>;
export type GetDocumentBlocksLazyQueryHookResult = ReturnType<typeof useGetDocumentBlocksLazyQuery>;
export type GetDocumentBlocksSuspenseQueryHookResult = ReturnType<typeof useGetDocumentBlocksSuspenseQuery>;
export type GetDocumentBlocksQueryResult = Apollo.QueryResult<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>;
export const GetDocsCountDocument = gql`
    query GetDocsCount($workspaceId: uuid!) {
  blocks_aggregate(
    where: {workspace_id: {_eq: $workspaceId}, type: {_eq: "page"}, deleted_at: {_is_null: true}}
  ) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useGetDocsCountQuery__
 *
 * To run a query within a React component, call `useGetDocsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocsCountQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetDocsCountQuery(baseOptions: Apollo.QueryHookOptions<GetDocsCountQuery, GetDocsCountQueryVariables> & ({ variables: GetDocsCountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocsCountQuery, GetDocsCountQueryVariables>(GetDocsCountDocument, options);
      }
export function useGetDocsCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocsCountQuery, GetDocsCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocsCountQuery, GetDocsCountQueryVariables>(GetDocsCountDocument, options);
        }
export function useGetDocsCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocsCountQuery, GetDocsCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocsCountQuery, GetDocsCountQueryVariables>(GetDocsCountDocument, options);
        }
export type GetDocsCountQueryHookResult = ReturnType<typeof useGetDocsCountQuery>;
export type GetDocsCountLazyQueryHookResult = ReturnType<typeof useGetDocsCountLazyQuery>;
export type GetDocsCountSuspenseQueryHookResult = ReturnType<typeof useGetDocsCountSuspenseQuery>;
export type GetDocsCountQueryResult = Apollo.QueryResult<GetDocsCountQuery, GetDocsCountQueryVariables>;
export const GetSharedWithMeDocsDocument = gql`
    query GetSharedWithMeDocs($userId: uuid!) {
  blocks(
    where: {type: {_eq: "page"}, deleted_at: {_is_null: true}, access_requests: {requester_id: {_eq: $userId}, status: {_eq: "approved"}}}
    order_by: {updated_at: desc}
  ) {
    id
    content
    cover_image
    created_at
    updated_at
    user_id
    workspace_id
    folder {
      id
      name
    }
    sub_blocks(order_by: {position: asc}, limit: 10) {
      id
      type
      content
      position
      tasks {
        id
        status
        schedule_date
        deadline_date
      }
    }
    access_requests(where: {requester_id: {_eq: $userId}}) {
      permission_type
      status
    }
  }
}
    `;

/**
 * __useGetSharedWithMeDocsQuery__
 *
 * To run a query within a React component, call `useGetSharedWithMeDocsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSharedWithMeDocsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSharedWithMeDocsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetSharedWithMeDocsQuery(baseOptions: Apollo.QueryHookOptions<GetSharedWithMeDocsQuery, GetSharedWithMeDocsQueryVariables> & ({ variables: GetSharedWithMeDocsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSharedWithMeDocsQuery, GetSharedWithMeDocsQueryVariables>(GetSharedWithMeDocsDocument, options);
      }
export function useGetSharedWithMeDocsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSharedWithMeDocsQuery, GetSharedWithMeDocsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSharedWithMeDocsQuery, GetSharedWithMeDocsQueryVariables>(GetSharedWithMeDocsDocument, options);
        }
export function useGetSharedWithMeDocsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSharedWithMeDocsQuery, GetSharedWithMeDocsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSharedWithMeDocsQuery, GetSharedWithMeDocsQueryVariables>(GetSharedWithMeDocsDocument, options);
        }
export type GetSharedWithMeDocsQueryHookResult = ReturnType<typeof useGetSharedWithMeDocsQuery>;
export type GetSharedWithMeDocsLazyQueryHookResult = ReturnType<typeof useGetSharedWithMeDocsLazyQuery>;
export type GetSharedWithMeDocsSuspenseQueryHookResult = ReturnType<typeof useGetSharedWithMeDocsSuspenseQuery>;
export type GetSharedWithMeDocsQueryResult = Apollo.QueryResult<GetSharedWithMeDocsQuery, GetSharedWithMeDocsQueryVariables>;