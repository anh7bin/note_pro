import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type GetFoldersQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetFoldersQuery = { __typename?: 'query_root', folders: Array<{ __typename?: 'folders', id: string, name: string, description?: string | null, color?: string | null, icon?: string | null, parent_id?: string | null, created_at?: string | null }> };

export type GetFolderByIdQueryVariables = Types.Exact<{
  folderId: Types.Scalars['uuid']['input'];
}>;


export type GetFolderByIdQuery = { __typename?: 'query_root', folders_by_pk?: { __typename?: 'folders', id: string, name: string, description?: string | null, color?: string | null, icon?: string | null, parent_id?: string | null, created_at?: string | null, workspace_id?: string | null, children: Array<{ __typename?: 'folders', id: string, name: string, description?: string | null, color?: string | null, icon?: string | null, created_at?: string | null, blocks_aggregate: { __typename?: 'blocks_aggregate', aggregate?: { __typename?: 'blocks_aggregate_fields', count: number } | null } }>, blocks: Array<{ __typename?: 'blocks', id: string, content?: any | null, cover_image?: string | null, created_at?: string | null, updated_at?: string | null, workspace_id?: string | null, user_id?: string | null, document_stars: Array<{ __typename?: 'document_stars', document_id: string }>, folder?: { __typename?: 'folders', id: string, name: string } | null, sub_blocks: Array<{ __typename?: 'blocks', id: string, type: string, content?: any | null, tasks: Array<{ __typename?: 'tasks', id: string, status?: string | null, schedule_date?: string | null, deadline_date?: string | null }> }> }> } | null };


export const GetFoldersDocument = gql`
    query GetFolders($workspaceId: uuid!) {
  folders(
    order_by: {created_at: desc}
    where: {workspace_id: {_eq: $workspaceId}}
  ) {
    id
    name
    description
    color
    icon
    parent_id
    created_at
  }
}
    `;

/**
 * __useGetFoldersQuery__
 *
 * To run a query within a React component, call `useGetFoldersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFoldersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFoldersQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetFoldersQuery(baseOptions: Apollo.QueryHookOptions<GetFoldersQuery, GetFoldersQueryVariables> & ({ variables: GetFoldersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument, options);
      }
export function useGetFoldersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFoldersQuery, GetFoldersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument, options);
        }
export function useGetFoldersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFoldersQuery, GetFoldersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument, options);
        }
export type GetFoldersQueryHookResult = ReturnType<typeof useGetFoldersQuery>;
export type GetFoldersLazyQueryHookResult = ReturnType<typeof useGetFoldersLazyQuery>;
export type GetFoldersSuspenseQueryHookResult = ReturnType<typeof useGetFoldersSuspenseQuery>;
export type GetFoldersQueryResult = Apollo.QueryResult<GetFoldersQuery, GetFoldersQueryVariables>;
export const GetFolderByIdDocument = gql`
    query GetFolderById($folderId: uuid!) {
  folders_by_pk(id: $folderId) {
    id
    name
    description
    color
    icon
    parent_id
    created_at
    workspace_id
    children(order_by: {created_at: desc}) {
      id
      name
      description
      color
      icon
      created_at
      blocks_aggregate(where: {type: {_eq: "page"}, deleted_at: {_is_null: true}}) {
        aggregate {
          count
        }
      }
    }
    blocks(
      where: {type: {_eq: "page"}, deleted_at: {_is_null: true}}
      order_by: {updated_at: desc}
    ) {
      id
      content
      cover_image
      created_at
      updated_at
      workspace_id
      user_id
      document_stars {
        document_id
      }
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
}
    `;

/**
 * __useGetFolderByIdQuery__
 *
 * To run a query within a React component, call `useGetFolderByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFolderByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFolderByIdQuery({
 *   variables: {
 *      folderId: // value for 'folderId'
 *   },
 * });
 */
export function useGetFolderByIdQuery(baseOptions: Apollo.QueryHookOptions<GetFolderByIdQuery, GetFolderByIdQueryVariables> & ({ variables: GetFolderByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFolderByIdQuery, GetFolderByIdQueryVariables>(GetFolderByIdDocument, options);
      }
export function useGetFolderByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFolderByIdQuery, GetFolderByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFolderByIdQuery, GetFolderByIdQueryVariables>(GetFolderByIdDocument, options);
        }
export function useGetFolderByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFolderByIdQuery, GetFolderByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFolderByIdQuery, GetFolderByIdQueryVariables>(GetFolderByIdDocument, options);
        }
export type GetFolderByIdQueryHookResult = ReturnType<typeof useGetFolderByIdQuery>;
export type GetFolderByIdLazyQueryHookResult = ReturnType<typeof useGetFolderByIdLazyQuery>;
export type GetFolderByIdSuspenseQueryHookResult = ReturnType<typeof useGetFolderByIdSuspenseQuery>;
export type GetFolderByIdQueryResult = Apollo.QueryResult<GetFolderByIdQuery, GetFolderByIdQueryVariables>;