import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = { ignoreResults: true } as const;
export type CreateTaskMutationVariables = Types.Exact<{
    input: Types.TasksInsertInput;
}>;

export type CreateTaskMutation = {
    __typename?: 'mutation_root';
    insert_tasks_one?: {
        __typename?: 'tasks';
        id: string;
        block_id?: string | null;
        user_id?: string | null;
        status?: string | null;
        deadline_date?: string | null;
        schedule_date?: string | null;
        priority?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
    } | null;
};

export type UpdateTaskMutationVariables = Types.Exact<{
    id: Types.Scalars['uuid']['input'];
    input: Types.TasksSetInput;
}>;

export type UpdateTaskMutation = {
    __typename?: 'mutation_root';
    update_tasks_by_pk?: {
        __typename?: 'tasks';
        id: string;
        block_id?: string | null;
        user_id?: string | null;
        status?: string | null;
        deadline_date?: string | null;
        schedule_date?: string | null;
        priority?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
    } | null;
};

export type UpdateTaskDetailsMutationVariables = Types.Exact<{
    id: Types.Scalars['uuid']['input'];
    taskInput: Types.TasksSetInput;
    blockId: Types.Scalars['uuid']['input'];
    blockInput: Types.BlocksSetInput;
}>;

export type UpdateTaskDetailsMutation = {
    __typename?: 'mutation_root';
    update_tasks_by_pk?: {
        __typename?: 'tasks';
        id: string;
        schedule_date?: string | null;
        deadline_date?: string | null;
        priority?: string | null;
    } | null;
    update_blocks_by_pk?: {
        __typename?: 'blocks';
        id: string;
        content?: any | null;
        page_id?: string | null;
    } | null;
};

export const CreateTaskDocument = gql`
    mutation CreateTask($input: tasks_insert_input!) {
        insert_tasks_one(object: $input) {
            id
            block_id
            user_id
            status
            deadline_date
            schedule_date
            priority
            created_at
            updated_at
        }
    }
`;
export type CreateTaskMutationFn = Apollo.MutationFunction<
    CreateTaskMutation,
    CreateTaskMutationVariables
>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTaskMutation(
    baseOptions?: Apollo.MutationHookOptions<
        CreateTaskMutation,
        CreateTaskMutationVariables
    >
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(
        CreateTaskDocument,
        options
    );
}
export type CreateTaskMutationHookResult = ReturnType<
    typeof useCreateTaskMutation
>;
export type CreateTaskMutationResult =
    Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<
    CreateTaskMutation,
    CreateTaskMutationVariables
>;
export const UpdateTaskDocument = gql`
    mutation UpdateTask($id: uuid!, $input: tasks_set_input!) {
        update_tasks_by_pk(pk_columns: { id: $id }, _set: $input) {
            id
            block_id
            user_id
            status
            deadline_date
            schedule_date
            priority
            created_at
            updated_at
        }
    }
`;
export type UpdateTaskMutationFn = Apollo.MutationFunction<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTaskMutation(
    baseOptions?: Apollo.MutationHookOptions<
        UpdateTaskMutation,
        UpdateTaskMutationVariables
    >
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(
        UpdateTaskDocument,
        options
    );
}
export type UpdateTaskMutationHookResult = ReturnType<
    typeof useUpdateTaskMutation
>;
export type UpdateTaskMutationResult =
    Apollo.MutationResult<UpdateTaskMutation>;
export type UpdateTaskMutationOptions = Apollo.BaseMutationOptions<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
>;
export const UpdateTaskDetailsDocument = gql`
    mutation UpdateTaskDetails(
        $id: uuid!
        $taskInput: tasks_set_input!
        $blockId: uuid!
        $blockInput: blocks_set_input!
    ) {
        update_tasks_by_pk(pk_columns: { id: $id }, _set: $taskInput) {
            id
            schedule_date
            deadline_date
            priority
        }
        update_blocks_by_pk(pk_columns: { id: $blockId }, _set: $blockInput) {
            id
            content
            page_id
        }
    }
`;
export type UpdateTaskDetailsMutationFn = Apollo.MutationFunction<
    UpdateTaskDetailsMutation,
    UpdateTaskDetailsMutationVariables
>;

/**
 * __useUpdateTaskDetailsMutation__
 *
 * To run a mutation, you first call `useUpdateTaskDetailsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskDetailsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskDetailsMutation, { data, loading, error }] = useUpdateTaskDetailsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      taskInput: // value for 'taskInput'
 *      blockId: // value for 'blockId'
 *      blockInput: // value for 'blockInput'
 *   },
 * });
 */
export function useUpdateTaskDetailsMutation(
    baseOptions?: Apollo.MutationHookOptions<
        UpdateTaskDetailsMutation,
        UpdateTaskDetailsMutationVariables
    >
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<
        UpdateTaskDetailsMutation,
        UpdateTaskDetailsMutationVariables
    >(UpdateTaskDetailsDocument, options);
}
export type UpdateTaskDetailsMutationHookResult = ReturnType<
    typeof useUpdateTaskDetailsMutation
>;
export type UpdateTaskDetailsMutationResult =
    Apollo.MutationResult<UpdateTaskDetailsMutation>;
export type UpdateTaskDetailsMutationOptions = Apollo.BaseMutationOptions<
    UpdateTaskDetailsMutation,
    UpdateTaskDetailsMutationVariables
>;
