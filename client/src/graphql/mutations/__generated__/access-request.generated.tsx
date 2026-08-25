import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type CreateAccessRequestMutationVariables = Types.Exact<{
  input: Types.AccessRequestsInsertInput;
}>;


export type CreateAccessRequestMutation = { __typename?: 'mutation_root', insert_access_requests_one?: { __typename?: 'access_requests', id: string, document_id: string, requester_id: string, owner_id: string, status?: string | null, message?: string | null, permission_type?: string | null, created_at?: string | null, updated_at?: string | null } | null };

export type UpdateAccessRequestStatusMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  status: Types.Scalars['String']['input'];
  updated_at: Types.Scalars['timestamptz']['input'];
}>;


export type UpdateAccessRequestStatusMutation = { __typename?: 'mutation_root', update_access_requests_by_pk?: { __typename?: 'access_requests', id: string, status?: string | null, updated_at?: string | null, requester_id: string, document_id: string, permission_type?: string | null } | null };


export const CreateAccessRequestDocument = gql`
    mutation CreateAccessRequest($input: access_requests_insert_input!) {
  insert_access_requests_one(
    object: $input
    on_conflict: {constraint: access_requests_document_id_requester_id_key, update_columns: [permission_type, status, message, updated_at]}
  ) {
    id
    document_id
    requester_id
    owner_id
    status
    message
    permission_type
    created_at
    updated_at
  }
}
    `;
export type CreateAccessRequestMutationFn = Apollo.MutationFunction<CreateAccessRequestMutation, CreateAccessRequestMutationVariables>;

/**
 * __useCreateAccessRequestMutation__
 *
 * To run a mutation, you first call `useCreateAccessRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccessRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccessRequestMutation, { data, loading, error }] = useCreateAccessRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAccessRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccessRequestMutation, CreateAccessRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccessRequestMutation, CreateAccessRequestMutationVariables>(CreateAccessRequestDocument, options);
      }
export type CreateAccessRequestMutationHookResult = ReturnType<typeof useCreateAccessRequestMutation>;
export type CreateAccessRequestMutationResult = Apollo.MutationResult<CreateAccessRequestMutation>;
export type CreateAccessRequestMutationOptions = Apollo.BaseMutationOptions<CreateAccessRequestMutation, CreateAccessRequestMutationVariables>;
export const UpdateAccessRequestStatusDocument = gql`
    mutation UpdateAccessRequestStatus($id: uuid!, $status: String!, $updated_at: timestamptz!) {
  update_access_requests_by_pk(
    pk_columns: {id: $id}
    _set: {status: $status, updated_at: $updated_at}
  ) {
    id
    status
    updated_at
    requester_id
    document_id
    permission_type
  }
}
    `;
export type UpdateAccessRequestStatusMutationFn = Apollo.MutationFunction<UpdateAccessRequestStatusMutation, UpdateAccessRequestStatusMutationVariables>;

/**
 * __useUpdateAccessRequestStatusMutation__
 *
 * To run a mutation, you first call `useUpdateAccessRequestStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccessRequestStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccessRequestStatusMutation, { data, loading, error }] = useUpdateAccessRequestStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      status: // value for 'status'
 *      updated_at: // value for 'updated_at'
 *   },
 * });
 */
export function useUpdateAccessRequestStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAccessRequestStatusMutation, UpdateAccessRequestStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAccessRequestStatusMutation, UpdateAccessRequestStatusMutationVariables>(UpdateAccessRequestStatusDocument, options);
      }
export type UpdateAccessRequestStatusMutationHookResult = ReturnType<typeof useUpdateAccessRequestStatusMutation>;
export type UpdateAccessRequestStatusMutationResult = Apollo.MutationResult<UpdateAccessRequestStatusMutation>;
export type UpdateAccessRequestStatusMutationOptions = Apollo.BaseMutationOptions<UpdateAccessRequestStatusMutation, UpdateAccessRequestStatusMutationVariables>;