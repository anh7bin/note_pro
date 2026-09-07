import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type GetAllTasksQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetAllTasksQuery = { __typename?: 'query_root', tasks: Array<{ __typename?: 'tasks', id: string, block_id?: string | null, user_id?: string | null, status?: string | null, deadline_date?: string | null, schedule_date?: string | null, priority?: string | null, created_at?: string | null, updated_at?: string | null, block?: { __typename?: 'blocks', id: string, content?: any | null, type: string } | null }> };

export type GetCompletedTasksQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetCompletedTasksQuery = { __typename?: 'query_root', tasks: Array<{ __typename?: 'tasks', id: string, block_id?: string | null, user_id?: string | null, status?: string | null, deadline_date?: string | null, schedule_date?: string | null, priority?: string | null, created_at?: string | null, updated_at?: string | null, block?: { __typename?: 'blocks', id: string, content?: any | null, type: string } | null }> };

export type GetAllScheduledTasksQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetAllScheduledTasksQuery = { __typename?: 'query_root', tasks: Array<{ __typename?: 'tasks', id: string, block_id?: string | null, user_id?: string | null, status?: string | null, deadline_date?: string | null, schedule_date?: string | null, priority?: string | null, created_at?: string | null, updated_at?: string | null, block?: { __typename?: 'blocks', id: string, content?: any | null, type: string, page_id?: string | null, page?: { __typename?: 'blocks', id: string, content?: any | null } | null } | null }> };

export type GetTodayTasksQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
  today: Types.Scalars['date']['input'];
}>;


export type GetTodayTasksQuery = { __typename?: 'query_root', tasks: Array<{ __typename?: 'tasks', id: string, block_id?: string | null, user_id?: string | null, status?: string | null, deadline_date?: string | null, schedule_date?: string | null, priority?: string | null, created_at?: string | null, updated_at?: string | null, block?: { __typename?: 'blocks', id: string, content?: any | null, type: string } | null }> };

export type GetTodoTasksQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetTodoTasksQuery = { __typename?: 'query_root', tasks: Array<{ __typename?: 'tasks', id: string, block_id?: string | null, user_id?: string | null, status?: string | null, deadline_date?: string | null, schedule_date?: string | null, priority?: string | null, created_at?: string | null, updated_at?: string | null, block?: { __typename?: 'blocks', id: string, content?: any | null, type: string } | null }> };

export type GetTasksQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetTasksQuery = { __typename?: 'query_root', tasks: Array<{ __typename?: 'tasks', id: string, block_id?: string | null, user_id?: string | null, status?: string | null, deadline_date?: string | null, schedule_date?: string | null, priority?: string | null, created_at?: string | null, updated_at?: string | null, block?: { __typename?: 'blocks', id: string, content?: any | null, type: string } | null }> };


export const GetAllTasksDocument = gql`
    query GetAllTasks($workspaceId: uuid!) {
  tasks(
    where: {block: {workspace_id: {_eq: $workspaceId}, page_id: {_is_null: true}}, status: {_neq: "completed"}}
    order_by: {created_at: desc}
  ) {
    id
    block_id
    user_id
    status
    deadline_date
    schedule_date
    priority
    created_at
    updated_at
    block {
      id
      content
      type
    }
  }
}
    `;

/**
 * __useGetAllTasksQuery__
 *
 * To run a query within a React component, call `useGetAllTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTasksQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAllTasksQuery(baseOptions: Apollo.QueryHookOptions<GetAllTasksQuery, GetAllTasksQueryVariables> & ({ variables: GetAllTasksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllTasksQuery, GetAllTasksQueryVariables>(GetAllTasksDocument, options);
      }
export function useGetAllTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTasksQuery, GetAllTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllTasksQuery, GetAllTasksQueryVariables>(GetAllTasksDocument, options);
        }
export function useGetAllTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllTasksQuery, GetAllTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllTasksQuery, GetAllTasksQueryVariables>(GetAllTasksDocument, options);
        }
export type GetAllTasksQueryHookResult = ReturnType<typeof useGetAllTasksQuery>;
export type GetAllTasksLazyQueryHookResult = ReturnType<typeof useGetAllTasksLazyQuery>;
export type GetAllTasksSuspenseQueryHookResult = ReturnType<typeof useGetAllTasksSuspenseQuery>;
export type GetAllTasksQueryResult = Apollo.QueryResult<GetAllTasksQuery, GetAllTasksQueryVariables>;
export const GetCompletedTasksDocument = gql`
    query GetCompletedTasks($workspaceId: uuid!) {
  tasks(
    where: {block: {workspace_id: {_eq: $workspaceId}, page_id: {_is_null: true}}, status: {_eq: "completed"}}
    order_by: {updated_at: desc}
  ) {
    id
    block_id
    user_id
    status
    deadline_date
    schedule_date
    priority
    created_at
    updated_at
    block {
      id
      content
      type
    }
  }
}
    `;

/**
 * __useGetCompletedTasksQuery__
 *
 * To run a query within a React component, call `useGetCompletedTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompletedTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompletedTasksQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetCompletedTasksQuery(baseOptions: Apollo.QueryHookOptions<GetCompletedTasksQuery, GetCompletedTasksQueryVariables> & ({ variables: GetCompletedTasksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCompletedTasksQuery, GetCompletedTasksQueryVariables>(GetCompletedTasksDocument, options);
      }
export function useGetCompletedTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCompletedTasksQuery, GetCompletedTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCompletedTasksQuery, GetCompletedTasksQueryVariables>(GetCompletedTasksDocument, options);
        }
export function useGetCompletedTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCompletedTasksQuery, GetCompletedTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCompletedTasksQuery, GetCompletedTasksQueryVariables>(GetCompletedTasksDocument, options);
        }
export type GetCompletedTasksQueryHookResult = ReturnType<typeof useGetCompletedTasksQuery>;
export type GetCompletedTasksLazyQueryHookResult = ReturnType<typeof useGetCompletedTasksLazyQuery>;
export type GetCompletedTasksSuspenseQueryHookResult = ReturnType<typeof useGetCompletedTasksSuspenseQuery>;
export type GetCompletedTasksQueryResult = Apollo.QueryResult<GetCompletedTasksQuery, GetCompletedTasksQueryVariables>;
export const GetAllScheduledTasksDocument = gql`
    query GetAllScheduledTasks($workspaceId: uuid!) {
  tasks(
    where: {block: {workspace_id: {_eq: $workspaceId}}, schedule_date: {_is_null: false}, status: {_neq: "completed"}}
    order_by: {schedule_date: asc}
  ) {
    id
    block_id
    user_id
    status
    deadline_date
    schedule_date
    priority
    created_at
    updated_at
    block {
      id
      content
      type
      page_id
      page {
        id
        content
      }
    }
  }
}
    `;

/**
 * __useGetAllScheduledTasksQuery__
 *
 * To run a query within a React component, call `useGetAllScheduledTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllScheduledTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllScheduledTasksQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAllScheduledTasksQuery(baseOptions: Apollo.QueryHookOptions<GetAllScheduledTasksQuery, GetAllScheduledTasksQueryVariables> & ({ variables: GetAllScheduledTasksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllScheduledTasksQuery, GetAllScheduledTasksQueryVariables>(GetAllScheduledTasksDocument, options);
      }
export function useGetAllScheduledTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllScheduledTasksQuery, GetAllScheduledTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllScheduledTasksQuery, GetAllScheduledTasksQueryVariables>(GetAllScheduledTasksDocument, options);
        }
export function useGetAllScheduledTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllScheduledTasksQuery, GetAllScheduledTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllScheduledTasksQuery, GetAllScheduledTasksQueryVariables>(GetAllScheduledTasksDocument, options);
        }
export type GetAllScheduledTasksQueryHookResult = ReturnType<typeof useGetAllScheduledTasksQuery>;
export type GetAllScheduledTasksLazyQueryHookResult = ReturnType<typeof useGetAllScheduledTasksLazyQuery>;
export type GetAllScheduledTasksSuspenseQueryHookResult = ReturnType<typeof useGetAllScheduledTasksSuspenseQuery>;
export type GetAllScheduledTasksQueryResult = Apollo.QueryResult<GetAllScheduledTasksQuery, GetAllScheduledTasksQueryVariables>;
export const GetTodayTasksDocument = gql`
    query GetTodayTasks($workspaceId: uuid!, $today: date!) {
  tasks(
    where: {block: {workspace_id: {_eq: $workspaceId}, page_id: {_is_null: true}}, schedule_date: {_eq: $today}, status: {_neq: "completed"}}
    order_by: {created_at: desc}
  ) {
    id
    block_id
    user_id
    status
    deadline_date
    schedule_date
    priority
    created_at
    updated_at
    block {
      id
      content
      type
    }
  }
}
    `;

/**
 * __useGetTodayTasksQuery__
 *
 * To run a query within a React component, call `useGetTodayTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodayTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodayTasksQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      today: // value for 'today'
 *   },
 * });
 */
export function useGetTodayTasksQuery(baseOptions: Apollo.QueryHookOptions<GetTodayTasksQuery, GetTodayTasksQueryVariables> & ({ variables: GetTodayTasksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTodayTasksQuery, GetTodayTasksQueryVariables>(GetTodayTasksDocument, options);
      }
export function useGetTodayTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTodayTasksQuery, GetTodayTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTodayTasksQuery, GetTodayTasksQueryVariables>(GetTodayTasksDocument, options);
        }
export function useGetTodayTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTodayTasksQuery, GetTodayTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTodayTasksQuery, GetTodayTasksQueryVariables>(GetTodayTasksDocument, options);
        }
export type GetTodayTasksQueryHookResult = ReturnType<typeof useGetTodayTasksQuery>;
export type GetTodayTasksLazyQueryHookResult = ReturnType<typeof useGetTodayTasksLazyQuery>;
export type GetTodayTasksSuspenseQueryHookResult = ReturnType<typeof useGetTodayTasksSuspenseQuery>;
export type GetTodayTasksQueryResult = Apollo.QueryResult<GetTodayTasksQuery, GetTodayTasksQueryVariables>;
export const GetTodoTasksDocument = gql`
    query GetTodoTasks($workspaceId: uuid!) {
  tasks(
    where: {block: {workspace_id: {_eq: $workspaceId}, page_id: {_is_null: true}}, status: {_eq: "todo"}}
    order_by: {created_at: desc}
  ) {
    id
    block_id
    user_id
    status
    deadline_date
    schedule_date
    priority
    created_at
    updated_at
    block {
      id
      content
      type
    }
  }
}
    `;

/**
 * __useGetTodoTasksQuery__
 *
 * To run a query within a React component, call `useGetTodoTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodoTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodoTasksQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetTodoTasksQuery(baseOptions: Apollo.QueryHookOptions<GetTodoTasksQuery, GetTodoTasksQueryVariables> & ({ variables: GetTodoTasksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTodoTasksQuery, GetTodoTasksQueryVariables>(GetTodoTasksDocument, options);
      }
export function useGetTodoTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTodoTasksQuery, GetTodoTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTodoTasksQuery, GetTodoTasksQueryVariables>(GetTodoTasksDocument, options);
        }
export function useGetTodoTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTodoTasksQuery, GetTodoTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTodoTasksQuery, GetTodoTasksQueryVariables>(GetTodoTasksDocument, options);
        }
export type GetTodoTasksQueryHookResult = ReturnType<typeof useGetTodoTasksQuery>;
export type GetTodoTasksLazyQueryHookResult = ReturnType<typeof useGetTodoTasksLazyQuery>;
export type GetTodoTasksSuspenseQueryHookResult = ReturnType<typeof useGetTodoTasksSuspenseQuery>;
export type GetTodoTasksQueryResult = Apollo.QueryResult<GetTodoTasksQuery, GetTodoTasksQueryVariables>;
export const GetTasksDocument = gql`
    query GetTasks($workspaceId: uuid!) {
  tasks(
    where: {block: {workspace_id: {_eq: $workspaceId}, page_id: {_is_null: true}}}
    order_by: {created_at: desc}
  ) {
    id
    block_id
    user_id
    status
    deadline_date
    schedule_date
    priority
    created_at
    updated_at
    block {
      id
      content
      type
    }
  }
}
    `;

/**
 * __useGetTasksQuery__
 *
 * To run a query within a React component, call `useGetTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTasksQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetTasksQuery(baseOptions: Apollo.QueryHookOptions<GetTasksQuery, GetTasksQueryVariables> & ({ variables: GetTasksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTasksQuery, GetTasksQueryVariables>(GetTasksDocument, options);
      }
export function useGetTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTasksQuery, GetTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTasksQuery, GetTasksQueryVariables>(GetTasksDocument, options);
        }
export function useGetTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTasksQuery, GetTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTasksQuery, GetTasksQueryVariables>(GetTasksDocument, options);
        }
export type GetTasksQueryHookResult = ReturnType<typeof useGetTasksQuery>;
export type GetTasksLazyQueryHookResult = ReturnType<typeof useGetTasksLazyQuery>;
export type GetTasksSuspenseQueryHookResult = ReturnType<typeof useGetTasksSuspenseQuery>;
export type GetTasksQueryResult = Apollo.QueryResult<GetTasksQuery, GetTasksQueryVariables>;